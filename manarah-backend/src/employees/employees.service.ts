import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

// حقول المستخدم المسموح إرجاعها مع بيانات الموظف — يستبعد password صراحة
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
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        user: { select: SAFE_USER_SELECT }, // select بدل include: true لمنع تسريب password المشفّرة
        mosque: true, // ADDED: بيانات المسجد الذي يعمل به الموظف
      },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: { select: SAFE_USER_SELECT }, // select بدل include: true لمنع تسريب password المشفّرة
        mosque: true, // ADDED
      },
    });

    if (!employee) {
      throw new NotFoundException('الموظف غير موجود');
    }

    return employee;
  }

  // ADDED: يتحقق من وجود المسجد فعلياً قبل ربط الموظف به
  private async assertMosqueExists(mosqueId?: number) {
    if (mosqueId == null) return;
    const mosque = await this.prisma.mosque.findUnique({ where: { id: mosqueId } });
    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    await this.assertMosqueExists(createEmployeeDto.mosqueId); // ADDED
    try {
      const employee = await this.prisma.employee.create({
        data: createEmployeeDto,
        include: { mosque: true, user: { select: { id: true, role: true } } }, // ADDED: يعيد اسم المسجد فوراً بدل انتظار إعادة جلب القائمة
      });

      // ADDED: ربط موظف بحساب دخول موجود كان يترك دور ذلك الحساب "مستخدم عادي" رغم أنه أصبح موظفاً فعلياً —
      // فيظهر بصفحة إدارة المستخدمين بدور مضلِّل. لا نلمس حسابات ADMIN/MANAGER أو من له دور مخصَّص آخر أصلاً
      if (employee.user && employee.user.role === Role.USER) {
        await this.prisma.user.update({
          where: { id: employee.user.id },
          data: { role: Role.EMPLOYEE },
        });
        employee.user.role = Role.EMPLOYEE;
      }

      return employee;
    } catch (error) {
      // كانت هذه الدالة بدون try/catch — أي خطأ Prisma خام كان يتسرب كـ 500 عام
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('هذا المستخدم مرتبط بموظف آخر بالفعل');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('معرف المستخدم غير موجود');
        }
      }
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    // التحقق من وجود الموظف قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الموظف غير موجود');
    }

    await this.assertMosqueExists(updateEmployeeDto.mosqueId); // ADDED

    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
      include: { mosque: true }, // ADDED
    });
  }

  async remove(id: number) {
    // التحقق من وجود الموظف قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الموظف غير موجود');
    }

    // MODIFIED: كان يحذف الموظف مباشرة فيفشل بخطأ قيد مفتاح أجنبي خام (500 غير مفهوم) إن كانت لديه أي تذكرة
    // صيانة مُسنَدة — نُحرّر التذاكر (تبقى موجودة، فقط بلا مُسنَد إليها) بدل رفض الحذف، ثم نحذف الموظف بعملية واحدة ذرّية
    return this.prisma.$transaction(async (tx) => {
      await tx.maintenanceTicket.updateMany({
        where: { assignedToId: id },
        data: { assignedToId: null },
      });
      return tx.employee.delete({ where: { id } });
    });
  }
}
