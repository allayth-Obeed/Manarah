import { PartialType } from '@nestjs/mapped-types';
import { CreatePreacherDto } from './create-preacher.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdatePreacherDto extends PartialType(CreatePreacherDto) {}
