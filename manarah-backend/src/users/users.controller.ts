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
  @Roles(Role.ADMIN, Role.MANAGER)
  async findAll() {
    return this.usersService.findAllBasic();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER فقط — إنشاء حساب مباشرة من صفحة إدارة المستخدمين
  @Roles(Role.ADMIN, Role.MANAGER)
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
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER فقط — تحديد دور المستخدم (مستخدم عادي/خطيب/موظف)
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, dto.role as Role);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard) // ADMIN/MANAGER فقط — تعيين كلمة سر جديدة لمستخدم عادي (لنسيان كلمة السر مثلاً)
  @Roles(Role.ADMIN, Role.MANAGER)
  async resetPassword(@Param('id', ParseIntPipe) id: number, @Body() dto: ResetUserPasswordDto) {
    return this.usersService.resetPassword(id, dto.newPassword);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // كان بدون RolesGuard: أي مستخدم مسجّل يقدر يحذف أي حساب
  @Roles(Role.ADMIN) // حذف حساب فردي: ADMIN فقط
  async removeUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const actingUserId = (req.user as any).userId;
    return this.usersService.removeUser(id, actingUserId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard) // كان بدون RolesGuard: أي مستخدم يقدر يمسح كل قاعدة المستخدمين
  @Roles(Role.ADMIN) // حذف جماعي لكل المستخدمين: ADMIN فقط
  async removeAll() {
    return this.usersService.removeAll();
  }
}
