import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

// ADDED: إنشاء حساب من صفحة إدارة المستخدمين (ADMIN/MANAGER) — بخلاف RegisterDto العام،
// يسمح هذا بتحديد الدور مباشرة عند الإنشاء، لكن يبقى محصوراً بنفس الأدوار المسموح إسنادها
// من updateRole (مستخدم عادي/خطيب/موظف) — لا يمكن إنشاء حساب ADMIN/MANAGER من هذه الشاشة إطلاقاً
export class CreateUserDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsOptional()
  @IsIn(['USER', 'PREACHER', 'EMPLOYEE'], { message: 'الدور غير صالح' })
  role?: 'USER' | 'PREACHER' | 'EMPLOYEE';

  // ADDED: المسمى الوظيفي عند اختيار دور "موظف" — بدونه كان يُنشأ سجل الموظف بمسمى عام ثابت "موظف" لا معنى له
  @IsOptional()
  @IsString()
  position?: string;
}
