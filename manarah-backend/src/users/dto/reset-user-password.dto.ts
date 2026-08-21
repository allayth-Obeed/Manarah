import { IsString, MinLength } from 'class-validator';

// يُستخدم من ADMIN/MANAGER لتعيين كلمة سر جديدة لمستخدم عادي (خطيب/موظف/مستخدم) دون معرفة كلمته الحالية
export class ResetUserPasswordDto {
  @IsString()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  newPassword: string;
}
