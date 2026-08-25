import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // ADDED: لاستقبال ملف الصورة الشخصية
import { diskStorage } from 'multer'; // ADDED
import { extname, join } from 'path'; // ADDED
import { randomUUID } from 'crypto'; // ADDED: اسم ملف فريد يمنع تصادم الأسماء
import type { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // فرض التحقق من الدور بعد التحقق من التوكن
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

// ADDED: أنواع الصور المسموحة فقط لرفع الصورة الشخصية
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER فقط — من يديرون ربط الخطباء/الموظفين بحسابات دخول
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  async findAll() {
    return this.usersService.findAllBasic();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER فقط — إنشاء حساب مباشرة من صفحة إدارة المستخدمين
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createByAdmin(dto);
  }

  @Get('me/overview')
  @UseGuards(JwtAuthGuard) // أي مستخدم مسجّل يرى لوحته الشخصية الخاصة به فقط
  async getMyOverview(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.usersService.findMyOverview(userId);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard) // أي مستخدم مسجّل يقدر يرفع صورته الشخصية (لا حاجة لدور خاص)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'avatars'),
        filename: (_req, file, callback) => {
          // اسم ملف عشوائي فريد + الامتداد الأصلي، لتفادي تصادم الأسماء وتخمين المسارات
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB كحد أقصى
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          callback(new BadRequestException('الصورة يجب أن تكون بصيغة JPEG أو PNG أو WEBP'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('لم يتم إرفاق أي صورة');
    }
    const userId = (req.user as any).userId; // يأتي من JwtStrategy.validate
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const user = await this.usersService.updateAvatar(userId, avatarUrl);
    return { avatarUrl: user.avatarUrl };
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER/SUPER_ADMIN — تحديد دور المستخدم (مستخدم عادي/خطيب/موظف)، أو تعديل حساب إداري تابع (حسب التسلسل الهرمي في role-hierarchy.ts)
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto, @Req() req: Request) {
    const actingRole = (req.user as any).role as Role;
    return this.usersService.updateRole(id, dto.role as Role, actingRole);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER/SUPER_ADMIN — تعيين كلمة سر جديدة لمستخدم (لنسيان كلمة السر مثلاً)، أو لحساب إداري تابع حسب التسلسل الهرمي
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  async resetPassword(@Param('id', ParseIntPipe) id: number, @Body() dto: ResetUserPasswordDto, @Req() req: Request) {
    const actingRole = (req.user as any).role as Role;
    return this.usersService.resetPassword(id, dto.newPassword, actingRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN) // MODIFIED: كان ADMIN فقط — الآن متساوٍ بين الثلاثة، والتسلسل الهرمي يحمي الحسابات الإدارية تحديداً (انظر UsersService.removeUser)
  async removeUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const actingUserId = (req.user as any).userId;
    const actingRole = (req.user as any).role as Role;
    return this.usersService.removeUser(id, actingUserId, actingRole);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN) // MODIFIED: كان ADMIN فقط — نفس صلاحيات الحذف الفردي أعلاه
  async removeAll() {
    return this.usersService.removeAll();
  }
}
