import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty({ message: 'عنوان الإعلان مطلوب' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'محتوى الإعلان مطلوب' })
  content: string;

  @IsNumber({}, { message: 'معرف المسجد مطلوب' })
  mosqueId: number;

  @IsOptional()
  @IsEnum(Priority, { message: 'أولوية الإعلان غير صالحة' })
  priority?: Priority;

  @IsOptional()
  isActive?: boolean;
}
