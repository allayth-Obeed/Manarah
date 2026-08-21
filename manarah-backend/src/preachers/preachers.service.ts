import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreatePreacherDto } from './dto/create-preacher.dto';
import { UpdatePreacherDto } from './dto/update-preacher.dto';

// حقول المستخدم المسموح إرجاعها مع بيانات الخطيب — يستبعد password صراحة
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class PreachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.preacher.findMany({
      include: {
        user: { select: SAFE_USER_SELECT }, // select بدل include: true لمنع تسريب password المشفّرة
        assignments: {
          include: { mosque: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const preacher = await this.prisma.preacher.findUnique({
      where: { id },
      include: {
        user: { select: SAFE_USER_SELECT }, // select بدل include: true لمنع تسريب password المشفّرة
        assignments: {
          include: { mosque: true },
        },
      },
    });

    if (!preacher) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    return preacher;
  }

  async create(createPreacherDto: CreatePreacherDto) {
    try {
      const preacher = await this.prisma.preacher.create({
        data: createPreacherDto,
        include: {
          user: { select: SAFE_USER_SELECT }, // select بدل include: true لمنع تسريب password المشفّرة
          assignments: {
            include: { mosque: true },
          },
        },
      });

      // ADDED: ربط خطيب بحساب دخول موجود كان يترك دور ذلك الحساب "مستخدم عادي" رغم أنه أصبح خطيباً فعلياً —
      // فيظهر بصفحة إدارة المستخدمين بدور مضلِّل. لا نلمس حسابات ADMIN/MANAGER أو من له دور مخصَّص آخر أصلاً
      if (preacher.user && preacher.user.role === Role.USER) {
        await this.prisma.user.update({
          where: { id: preacher.user.id },
          data: { role: Role.PREACHER },
        });
        preacher.user.role = Role.PREACHER;
      }

      return preacher;
    } catch (error) {
      // تحويل أخطاء Prisma الخام إلى استثناءات NestJS ذات معنى بدل 500 عام
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('هذا المستخدم مرتبط بخطيب آخر بالفعل');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('معرف المستخدم غير موجود');
        }
      }
      throw error;
    }
  }

  async update(id: number, updatePreacherDto: UpdatePreacherDto) {
    // التحقق من وجود الخطيب قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.preacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    return this.prisma.preacher.update({
      where: { id },
      data: updatePreacherDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود الخطيب قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.preacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    // MODIFIED: كان يحذف الخطيب مباشرة فيفشل بخطأ قيد مفتاح أجنبي خام (500 غير مفهوم) إن كان له أي تعيين —
    // نحذف تعييناته أولاً (كما تفعل بالضبط users.service.ts عند حذف حساب مرتبط بخطيب) ثم الخطيب، بعملية واحدة ذرّية
    return this.prisma.$transaction(async (tx) => {
      await tx.preacherAssignment.deleteMany({ where: { preacherId: id } });
      return tx.preacher.delete({ where: { id } });
    });
  }
}
