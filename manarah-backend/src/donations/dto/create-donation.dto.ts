import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateDonationDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم المتبرض مطلوب' })
  donorName: string;

  @IsNumber({}, { message: 'المبلغ مطلوب' })
  amount: number;

  @IsNumber({}, { message: 'معرف المسجد مطلوب' })
  mosqueId: number;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
