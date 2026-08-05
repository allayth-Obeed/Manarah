import { PartialType } from '@nestjs/mapped-types';
import { CreateMosqueDto } from './create-mosque.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdateMosqueDto extends PartialType(CreateMosqueDto) {}
