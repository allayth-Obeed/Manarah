import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MosqueNotificationsService } from '../notifications/mosque-notifications.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private mosqueNotifications: MosqueNotificationsService,
  ) {}

  async findAll() {
    return this.prisma.announcement.findMany({
      include: {
        mosque: true,
      },
    });
  }

  async findOne(id: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        mosque: true,
      },
    });

    if (!announcement) {
      throw new NotFoundException('الإعلان غير موجود');
    }

    return announcement;
  }

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    // التحقق من وجود المسجد أولاً بدل ترك خطأ FK خام يتسرب كـ 500 عام
    const mosque = await this.prisma.mosque.findUnique({
      where: { id: createAnnouncementDto.mosqueId },
    });
    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }

    const announcement = await this.prisma.announcement.create({
      data: createAnnouncementDto,
    });

    // ADDED: إشعار موجَّه لكل من يعمل بهذا المسجد (إمام/خطيب/مؤذن/إداري) بالإعلان الجديد
    this.mosqueNotifications.notifyMosqueStaff(announcement.mosqueId, 'announcement.created', {
      id: announcement.id,
      title: announcement.title,
      mosqueName: mosque.name,
    });

    return announcement;
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    // التحقق من وجود الإعلان قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الإعلان غير موجود');
    }

    return this.prisma.announcement.update({
      where: { id },
      data: updateAnnouncementDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود الإعلان قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الإعلان غير موجود');
    }

    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
