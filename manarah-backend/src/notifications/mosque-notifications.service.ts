import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

// يوجّه إشعارات خاصة بمسجد معيّن لكل من يعمل به فعلياً (موظفون مسندون + خطباء مُكلَّفون حالياً)
// بدل بث الحدث لكل المستخدمين المتصلين بالنظام بغض النظر عن صلته بهذا المسجد
@Injectable()
export class MosqueNotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  // يُرجع معرّفات مستخدمي كل من يعمل بهذا المسجد فعلياً (بدون إرسال) — يُستخدم لاستثنائهم من أي بث عام مطابق
  async getMosqueStaffUserIds(mosqueId: number): Promise<number[]> {
    const [employees, assignments] = await Promise.all([
      // الموظفون المسندون لهذا المسجد (إمام/خطيب/مؤذن/إداري...) ولديهم حساب دخول فعلي
      this.prisma.employee.findMany({
        where: { mosqueId, userId: { not: null } },
        select: { userId: true },
      }),
      // الخطباء المُكلَّفون حالياً بهذا المسجد ولديهم حساب دخول فعلي
      this.prisma.preacherAssignment.findMany({
        where: { mosqueId, isActive: true, preacher: { userId: { not: null } } },
        select: { preacher: { select: { userId: true } } },
      }),
    ]);

    const userIds = new Set<number>();
    employees.forEach((e) => e.userId != null && userIds.add(e.userId));
    assignments.forEach((a) => a.preacher.userId != null && userIds.add(a.preacher.userId));

    return [...userIds];
  }

  // يُرسل إشعاراً موجَّهاً لكل من يعمل بهذا المسجد، ويُرجع قائمة المستخدمين الذين استلموه
  // (ليستثنيهم المستدعي من أي بث عام لاحق لنفس الحدث ويمنع ازدواج التسليم)
  async notifyMosqueStaff(mosqueId: number, event: string, payload: unknown): Promise<number[]> {
    const userIds = await this.getMosqueStaffUserIds(mosqueId);
    if (userIds.length > 0) {
      this.gateway.emitToUsers(userIds, event, payload);
    }
    return userIds;
  }
}
