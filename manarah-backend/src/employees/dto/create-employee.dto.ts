import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsInt({ message: 'معرف المستخدم يجب أن يكون رقماً' })
  userId?: number;

  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'الوظيفة مطلوبة' })
  position: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'الراتب يجب أن يكون رقماً' })
  salary?: number;

  @IsOptional()
  @IsDateString({}, { message: 'تاريخ التوظيف غير صالح' })
  hireDate?: string;

  // ADDED: المسجد الذي يعمل به الموظف — يُستخدم لتوجيه إشعارات المسجد لموظفيه (إمام/خطيب/مؤذن...)
  @IsOptional()
  @IsInt({ message: 'المسجد غير صالح' })
  mosqueId?: number;
}
