import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateMosqueDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم المسجد مطلوب' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'المدينة مطلوبة' })
  city: string;

  @IsOptional()
  @IsNumber({}, { message: 'خطوط العرض يجب أن تكون رقماً' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'خطوط الطول يجب أن تكون رقماً' })
  longitude?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'السعة يجب أن تكون رقماً' })
  capacity?: number;
}
