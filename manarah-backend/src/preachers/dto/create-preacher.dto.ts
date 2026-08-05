import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreatePreacherDto {
  @IsOptional()
  @IsInt({ message: 'معرف المستخدم يجب أن يكون رقماً' })
  userId?: number;

  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  specialization?: string;
}
