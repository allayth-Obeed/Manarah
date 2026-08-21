import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    return user;
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
    role?: Role;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || Role.USER,
      },
    });
  }

  // ADDED: تحديث رابط الصورة الشخصية للمستخدم بعد رفعها
  async updateAvatar(id: number, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });
  }

  // ADDED: قائمة مبسّطة بكل المستخدمين لربطهم بسجل خطيب/موظف عند الإضافة (ADMIN/MANAGER فقط)
  // isLinked تخبر الواجهة أن هذا الحساب مرتبط بالفعل بخطيب أو موظف آخر فلا يُعرض كخيار متاح
  async findAllBasic() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        preacher: { select: { id: true } },
        employee: { select: { id: true } },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isLinked: Boolean(u.preacher || u.employee),
    }));
  }

  // ADDED: لوحة المستخدم الشخصية — بيانات الخطيب/الموظف المرتبطة بحسابه فعلياً (إن وُجدت) بغض النظر عن قيمة role
  // (role وحدها لا تكفي لتحديد "هل هو خطيب/موظف فعلاً" لأن ربط الحساب لا يُحدّث role تلقائياً حالياً)
  async findMyOverview(userId: number) {
    const [preacher, employee] = await Promise.all([
      this.prisma.preacher.findUnique({
        where: { userId },
        include: {
          assignments: {
            where: { isActive: true },
            include: { mosque: true },
            orderBy: { startDate: 'desc' },
          },
        },
      }),
      this.prisma.employee.findUnique({
        where: { userId },
        include: {
          mosque: true,
          assignedTickets: {
            where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
            include: { mosque: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ]);

    return { preacher, employee };
  }

  // ADDED: تحديث دور مستخدم (مستخدم عادي/خطيب/موظف فقط — لا يمكن الترقية إلى ADMIN/MANAGER من هنا،
  // ولا يمكن تعديل دور حساب هو أصلاً ADMIN/MANAGER لحماية حسابات مسؤولي النظام من التعديل عبر هذه الواجهة)
  async updateRole(id: number, role: Role) {
    const user = await this.findById(id);

    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      throw new ForbiddenException('لا يمكن تغيير دور حساب مسؤول النظام من هنا');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // ADDED: يسمح لـ ADMIN/MANAGER بتعيين كلمة سر جديدة لمستخدم عادي (لنسيان كلمة السر مثلاً) دون معرفة كلمته الحالية —
  // محمي بنفس حماية updateRole عن حسابات مسؤولي النظام لمنع أي تصعيد صلاحيات أو تعديل حساب مسؤول من هنا
  async resetPassword(id: number, newPassword: string) {
    const user = await this.findById(id);

    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      throw new ForbiddenException('لا يمكن تغيير كلمة سر حساب مسؤول النظام من هنا');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'تم تغيير كلمة السر بنجاح' };
  }

  async removeUser(id: number, actingUserId?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        preacher: true,
        employee: true,
      },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    // ADDED: حماية حسابات مسؤولي النظام من الحذف عبر واجهة إدارة المستخدمين، ومنع حذف المستخدم لحسابه الخاص بالخطأ
    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      throw new ForbiddenException('لا يمكن حذف حساب مسؤول النظام من هنا');
    }
    if (actingUserId != null && actingUserId === id) {
      throw new BadRequestException('لا يمكنك حذف حسابك الخاص');
    }

    // حذف البيانات المرتبطة أولاً إن وجدت
    if (user.preacher) {
      // يجب حذف تعيينات هذا الخطيب أولاً وإلا فشل الحذف بخطأ قيد مفتاح أجنبي خام
      await this.prisma.preacherAssignment.deleteMany({
        where: { preacherId: user.preacher.id },
      });
      await this.prisma.preacher.delete({
        where: { id: user.preacher.id },
      });
    }

    if (user.employee) {
      await this.prisma.employee.delete({
        where: { id: user.employee.id },
      });
    }

    // حذف المستخدم
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'تم حذف المستخدم بنجاح' };
  }

  async removeAll() {
    // حذف جميع البيانات المرتبطة بأولوية (مراعاة العلاقات)
    // أولاً: حذف تعيينات الإمام (PreacherAssignments)
    await this.prisma.preacherAssignment.deleteMany({});

    // ثانيًا: حذف البيانات الفردية
    await this.prisma.preacher.deleteMany({});
    await this.prisma.employee.deleteMany({});

    // ثالثًا: حذف المستخدمين
    const result = await this.prisma.user.deleteMany({});

    return {
      message: 'تم حذف جميع الحسابات بنجاح',
      count: result.count,
    };
  }
}
