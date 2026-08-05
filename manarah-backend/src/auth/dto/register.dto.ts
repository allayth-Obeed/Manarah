import { IsEmail, IsString, MinLength } from 'class-validator';

// لا يوجد حقل role هنا عمداً: التسجيل العام لا يجوز أن يحدد دور المستخدم
// (كان بالإمكان لأي شخص التسجيل كـ ADMIN مباشرة) — الدور يُفرض دائماً USER في auth.service
export class RegisterDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @IsString()
  name: string;
}
