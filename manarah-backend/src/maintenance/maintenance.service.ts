import { Injectable, NotFoundException } from '@nestjs/common';
import { MaintenanceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { MosqueNotificationsService } from '../notifications/mosque-notifications.service';
import { CreateMaintenanceTicketDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceTicketDto } from './dto/update-maintenance.dto';

const ticketInclude = {
  mosque: true,
  assignedTo: true,
} as const;

// الحالات التي تعني أن التذكرة أُغلقت فعلياً (تُستخدم لضبط resolvedAt تلقائياً)
const CLOSED_STATUSES: MaintenanceStatus[] = ['RESOLVED', 'CLOSED'];

@Injectable()
export class MaintenanceService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
    private mosqueNotifications: MosqueNotificationsService,
  ) {}

  async findAll() {
    return this.prisma.maintenanceTicket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.maintenanceTicket.findUnique({
      where: { id },
      include: ticketInclude,
    });

    if (!ticket) {
      throw new NotFoundException('تذكرة الصيانة غير موجودة');
    }

    return ticket;
  }

  async create(dto: CreateMaintenanceTicketDto) {
    const mosque = await this.prisma.mosque.findUnique({
      where: { id: dto.mosqueId },
    });
    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }

    const ticket = await this.prisma.maintenanceTicket.create({
      data: dto,
      include: ticketInclude,
    });

    const createdPayload = {
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      mosqueName: ticket.mosque?.name || null,
      createdAt: ticket.createdAt,
    };

    // ADDED: إشعار موجَّه لموظفي هذا المسجد تحديداً (إمام/خطيب/مؤذن) — هم الأولى بمعرفة عطل بمسجدهم
    const staffUserIds = await this.mosqueNotifications.notifyMosqueStaff(
      ticket.mosqueId,
      'maintenance.created',
      createdPayload,
    );

    // بث عام يصل لبقية المسؤولين المتصلين (لوحة التحكم الإدارية) — مع استثناء من استلم الإشعار الموجَّه فعلاً لتفادي التكرار
    this.notifications.emitEvent('maintenance.created', createdPayload, staffUserIds);

    return ticket;
  }

  async update(id: number, dto: UpdateMaintenanceTicketDto) {
    const existing = await this.prisma.maintenanceTicket.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('تذكرة الصيانة غير موجودة');
    }

    if (dto.mosqueId != null) {
      const mosque = await this.prisma.mosque.findUnique({
        where: { id: dto.mosqueId },
      });
      if (!mosque) {
        throw new NotFoundException('المسجد غير موجود');
      }
    }

    if (dto.assignedToId != null) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: dto.assignedToId },
      });
      if (!employee) {
        throw new NotFoundException('الموظف المسؤول غير موجود');
      }
    }

    // ADDED: ضبط/تصفير resolvedAt تلقائياً حسب انتقال الحالة بدل تركه يُدخَل يدوياً
    let resolvedAt = existing.resolvedAt;
    if (dto.status && CLOSED_STATUSES.includes(dto.status) && !CLOSED_STATUSES.includes(existing.status)) {
      resolvedAt = new Date();
    } else if (dto.status && !CLOSED_STATUSES.includes(dto.status)) {
      resolvedAt = null;
    }

    const updated = await this.prisma.maintenanceTicket.update({
      where: { id },
      data: { ...dto, resolvedAt },
      include: ticketInclude,
    });

    // بث لحظي فقط عند تغيّر الحالة فعلياً (وليس أي تعديل آخر بالتذكرة)
    if (dto.status && dto.status !== existing.status) {
      const statusPayload = {
        id: updated.id,
        title: updated.title,
        status: updated.status,
        mosqueName: updated.mosque?.name || null,
      };
      // ADDED: إشعار موجَّه لموظفي المسجد — يهمّهم معرفة أن عطل مسجدهم قيد المعالجة/تم حله
      const staffUserIds = await this.mosqueNotifications.notifyMosqueStaff(
        updated.mosqueId,
        'maintenance.statusChanged',
        statusPayload,
      );
      // بث عام لبقية المسؤولين، باستثناء من استلم الإشعار الموجَّه فعلاً
      this.notifications.emitEvent('maintenance.statusChanged', statusPayload, staffUserIds);
    }

    return updated;
  }

  async remove(id: number) {
    const existing = await this.prisma.maintenanceTicket.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('تذكرة الصيانة غير موجودة');
    }

    return this.prisma.maintenanceTicket.delete({ where: { id } });
  }
}
