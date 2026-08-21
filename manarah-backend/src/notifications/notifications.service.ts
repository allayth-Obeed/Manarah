import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// يحفظ إشعارات المستخدم الشخصية (تكليف خطبة، إسناد صيانة...) بقاعدة البيانات
// حتى يراها المستخدم عند دخوله لاحقاً، وليس فقط لو كان متصلاً لحظة وقوع الحدث
@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createForUser(userId: number, type: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, type, message },
    });
  }

  async findMine(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(userId: number, id: number) {
    // updateMany بدل update: يضمن أن المستخدم لا يقدر يعلّم إشعار مستخدم آخر كمقروء عبر تخمين id
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
