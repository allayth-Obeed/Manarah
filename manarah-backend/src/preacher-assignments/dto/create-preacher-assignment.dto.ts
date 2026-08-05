import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreatePreacherAssignmentDto {
  @IsInt({ message: 'معرف الخطيب مطلوب' })
  @IsNotEmpty({ message: 'معرف الخطيب مطلوب' })
  preacherId: number;

  @IsInt({ message: 'معرف المسجد مطلوب' })
  @IsNotEmpty({ message: 'معرف المسجد مطلوب' })
  mosqueId: number;

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
