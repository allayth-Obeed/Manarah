import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

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

  async removeUser(id: number) {
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
