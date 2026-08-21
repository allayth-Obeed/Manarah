import { IsIn } from 'class-validator';

// عمداً محصور بهذه الثلاثة فقط: ترقية حساب إلى ADMIN/MANAGER لا تتم عبر هذا الـ endpoint إطلاقاً
// (يتطلب ذلك تدخلاً يدوياً مباشراً بقاعدة البيانات لمنع أي تصعيد صلاحيات غير مقصود من واجهة الإدارة)
export class UpdateUserRoleDto {
  @IsIn(['USER', 'PREACHER', 'EMPLOYEE'], {
    message: 'الدور يجب أن يكون: مستخدم عادي، خطيب، أو موظف',
  })
  role: 'USER' | 'PREACHER' | 'EMPLOYEE';
}
