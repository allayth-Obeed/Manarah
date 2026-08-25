import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { isAdminTierRole, canActOnAdminTier } from '../auth/role-hierarchy';

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

  // ADDED: يقسّم اسم المستخدم الكامل إلى (اسم أول/اسم أخير) لتعبئة سجل الخطيب/الموظف المُنشأ تلقائياً —
  // الكلمة الأخيرة تُعتبر الاسم الأخير وما قبلها الاسم الأول، وإن كانت كلمة واحدة يبقى الاسم الأخير فارغاً
  private splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) {
      return { firstName: parts[0] || fullName, lastName: '' };
    }
    return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
  }

  // ADDED: تعيين دور "خطيب"/"موظف" لحساب كان يغيّر role فقط دون أي سجل فعلي، فيبقى الحساب غائباً تماماً
  // عن قوائم تعيين الخطباء (المبنية على جدول Preacher لا على role المستخدم) رغم أن دوره يظهر "خطيب" بالواجهة —
  // ننشئ السجل تلقائياً هنا إن لم يكن موجوداً بعد ليصبح الحساب قابلاً للتعيين فوراً. مشتركة بين updateRole وcreateByAdmin
  private async ensureRoleEntity(userId: number, name: string, email: string, role: Role, position?: string) {
    if (role === Role.PREACHER) {
      const existingPreacher = await this.prisma.preacher.findUnique({ where: { userId } });
      if (!existingPreacher) {
        const { firstName, lastName } = this.splitName(name);
        await this.prisma.preacher.create({
          data: { userId, firstName, lastName, email },
        });
      }
    } else if (role === Role.EMPLOYEE) {
      const existingEmployee = await this.prisma.employee.findUnique({ where: { userId } });
      if (!existingEmployee) {
        const { firstName, lastName } = this.splitName(name);
        // MODIFIED: مسمى وظيفي حقيقي إن أُرسل (من ديالوج "إضافة مستخدم")، وإلا قيمة افتراضية عامة
        // قابلة للتعديل لاحقاً من صفحة الموظفين (حال ترقية حساب موجود عبر updateRole بلا مسمى محدَّد)
        await this.prisma.employee.create({
          data: { userId, firstName, lastName, position: position?.trim() || 'موظف' },
        });
      }
    }
  }

  // MODIFIED: تحديث دور مستخدم — لا يمكن الترقية إلى ADMIN/MANAGER/SUPER_ADMIN من هنا (يتم فقط عبر تدخل مباشر
  // بقاعدة البيانات)، لكن تعديل حساب هو أصلاً ADMIN/MANAGER/SUPER_ADMIN أصبح ممكناً وفق التسلسل الهرمي:
  // فقط رتبة أعلى صراحةً تقدر تعدّل رتبة أدنى (مسؤول النظام > مدير > مشرف) — انظر role-hierarchy.ts
  async updateRole(id: number, role: Role, actingRole: Role) {
    const user = await this.findById(id);

    if (isAdminTierRole(user.role) && !canActOnAdminTier(actingRole, user.role)) {
      throw new ForbiddenException('لا تملك صلاحية كافية لتعديل هذا الحساب');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    await this.ensureRoleEntity(id, user.name, user.email, role);

    return updated;
  }

  // ADDED: إنشاء حساب جديد من صفحة إدارة المستخدمين مباشرة (ADMIN/MANAGER) — بخلاف التسجيل العام
  // الذي يفرض دور "مستخدم عادي" دائماً، هنا يمكن تحديد الدور فور الإنشاء (محصور بنفس الأدوار
  // المسموح إسنادها من updateRole)، وإن كان الدور "خطيب"/"موظف" يُنشأ سجله المرتبط تلقائياً كما بـ updateRole تماماً
  async createByAdmin(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم مسبقاً');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = (dto.role as Role) || Role.USER;

    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, name: dto.name, role },
      select: { id: true, name: true, email: true, role: true },
    });

    await this.ensureRoleEntity(user.id, user.name, user.email, role, dto.position);

    return user;
  }

  // MODIFIED: يسمح لـ ADMIN/MANAGER/SUPER_ADMIN بتعيين كلمة سر جديدة لمستخدم عادي دون معرفة كلمته الحالية،
  // وأيضاً لحساب إداري آخر (ADMIN/MANAGER/SUPER_ADMIN) طالما رتبة الفاعل أعلى صراحةً من رتبة الهدف
  async resetPassword(id: number, newPassword: string, actingRole: Role) {
    const user = await this.findById(id);

    if (isAdminTierRole(user.role) && !canActOnAdminTier(actingRole, user.role)) {
      throw new ForbiddenException('لا تملك صلاحية كافية لتغيير كلمة سر هذا الحساب');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'تم تغيير كلمة السر بنجاح' };
  }

  // MODIFIED: حذف حساب إداري (ADMIN/MANAGER/SUPER_ADMIN) أصبح ممكناً وفق التسلسل الهرمي بدل الحظر المطلق —
  // فقط رتبة أعلى صراحةً تقدر تحذف رتبة أدنى، ومنع حذف الحساب لنفسه يبقى قائماً دائماً بغض النظر عن الرتبة
  async removeUser(id: number, actingUserId?: number, actingRole?: Role) {
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

    if (actingUserId != null && actingUserId === id) {
      throw new BadRequestException('لا يمكنك حذف حسابك الخاص');
    }
    if (isAdminTierRole(user.role) && !canActOnAdminTier(actingRole as Role, user.role)) {
      throw new ForbiddenException('لا تملك صلاحية كافية لحذف هذا الحساب');
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
