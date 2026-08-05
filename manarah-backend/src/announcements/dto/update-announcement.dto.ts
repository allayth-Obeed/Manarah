import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
