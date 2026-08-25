import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MaintenanceStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { MosqueNotificationsService } from '../notifications/mosque-notifications.service';
import { NotificationsService } from '../notifications/notifications.service';
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
    private notificationsService: NotificationsService,
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

  async update(
    id: number,
    dto: UpdateMaintenanceTicketDto,
    actingUser: { userId: number; role: Role },
  ) {
    const existing = await this.prisma.maintenanceTicket.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('تذكرة الصيانة غير موجودة');
    }

    // MODIFIED: الموظف المُسنَدة إليه التذكرة يقدر يحدّث حالتها فقط (ليس إسنادها/عنوانها/مسجدها) — ADMIN/MANAGER/SUPER_ADMIN لهم التعديل الكامل
    const isPrivileged =
      actingUser.role === Role.ADMIN || actingUser.role === Role.MANAGER || actingUser.role === Role.SUPER_ADMIN;
    if (!isPrivileged) {
      // ملاحظة: target=es2022 يجعل كل حقول الـ DTO المُعرَّفة (حتى غير المُرسَلة) خصائص ذاتية بقيمة undefined
      // (دلالات class fields)، لذا Object.keys(dto) وحدها لا تكفي — لا بد من استبعاد القيم undefined فعلياً
      const fields = Object.keys(dto).filter((key) => (dto as Record<string, unknown>)[key] !== undefined);
      const onlyStatus = fields.length > 0 && fields.every((f) => f === 'status');
      if (!onlyStatus) {
        throw new ForbiddenException('يمكنك فقط تحديث حالة التذكرة المُسنَدة إليك');
      }
      const myEmployee = await this.prisma.employee.findUnique({ where: { userId: actingUser.userId } });
      if (!myEmployee || existing.assignedToId !== myEmployee.id) {
        throw new ForbiddenException('هذه التذكرة غير مُسنَدة إليك');
      }
    }

    if (dto.mosqueId != null) {
      const mosque = await this.prisma.mosque.findUnique({
        where: { id: dto.mosqueId },
      });
      if (!mosque) {
        throw new NotFoundException('المسجد غير موجود');
      }
    }

    let assignedEmployee: { userId: number | null } | null = null;
    if (dto.assignedToId != null) {
      assignedEmployee = await this.prisma.employee.findUnique({
        where: { id: dto.assignedToId },
      });
      if (!assignedEmployee) {
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

    // ADDED: إشعار شخصي محفوظ وموجَّه للموظف عند إسناد تذكرة له لأول مرة أو تحويلها لموظف آخر
    if (
      assignedEmployee?.userId &&
      dto.assignedToId != null &&
      dto.assignedToId !== existing.assignedToId
    ) {
      const message = `تم إسنادك لتذكرة صيانة: ${updated.title} في مسجد ${updated.mosque?.name || ''}`.trim();
      const saved = await this.notificationsService.createForUser(
        assignedEmployee.userId,
        'maintenance',
        message,
      );
      this.notifications.emitToUser(assignedEmployee.userId, 'notification.new', saved);
    }

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
