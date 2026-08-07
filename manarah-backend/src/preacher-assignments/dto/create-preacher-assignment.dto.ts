import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AssignmentRole } from '@prisma/client';

export class CreatePreacherAssignmentDto {
  @IsInt({ message: 'معرف الخطيب مطلوب' })
  @IsNotEmpty({ message: 'معرف الخطيب مطلوب' })
  preacherId: number;

  @IsInt({ message: 'معرف المسجد مطلوب' })
  @IsNotEmpty({ message: 'معرف المسجد مطلوب' })
  mosqueId: number;

  // ADDED: نوع التكليف — إمام (KHATIB افتراضياً لأن هذه الصفحة أساساً لتوزيع خطباء الجمعة)
  @IsOptional()
  @IsEnum(AssignmentRole, { message: 'نوع التكليف غير صالح' })
  role?: AssignmentRole;

  @IsOptional()
  @IsDateString({}, { message: 'تاريخ البدء غير صالح' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'تاريخ الانتهاء غير صالح' })
  endDate?: string;

  @IsOptional()
  @IsBoolean({ message: 'حالة التعيين يجب أن تكون منطقية' })
  isActive?: boolean;
}
