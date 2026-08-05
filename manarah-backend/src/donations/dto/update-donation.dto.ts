import { PartialType } from '@nestjs/mapped-types';
import { CreateDonationDto } from './create-donation.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdateDonationDto extends PartialType(CreateDonationDto) {}
