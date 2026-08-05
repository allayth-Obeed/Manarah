import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * GET /api/auth/me
   * التحقق من صحة التوكن وإعادة معلومات المستخدم
   * يستخدمه الفرونت إند في validateToken()
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    // JwtAuthGuard يتحقق من التوكن ويضيف user إلى request
    const userId = (req.user as any)?.userId;
    if (!userId) {
      // لا يوجد userId بالتوكن: جلسة غير صالحة — نفس شكل رد حالة "المستخدم غير موجود" أدناه
      return { valid: false };
    }

    try {
      // جلب بيانات المستخدم الكاملة من قاعدة البيانات
      const user = await this.usersService.findById(userId);
      const { password, ...safeUser } = user;
      return {
        valid: true,
        user: safeUser,
      };
    } catch {
      // findById يرمي NotFoundException لو حُذف المستخدم بعد إصدار التوكن — نوحّد الرد بدل تسرب 404 خام
      return { valid: false };
    }
  }
}
