import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateMaintenanceTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'عنوان التذكرة مطلوب' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ message: 'المسجد مطلوب' })
  mosqueId: number;

  @IsOptional()
  @IsEnum(Priority, { message: 'مستوى الأولوية غير صالح' })
  priority?: Priority;

  @IsOptional()
  @IsString()
  reportedBy?: string;
}
