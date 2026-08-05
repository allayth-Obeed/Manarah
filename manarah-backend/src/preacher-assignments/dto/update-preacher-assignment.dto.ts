import { PartialType } from '@nestjs/mapped-types';
import { CreatePreacherAssignmentDto } from './create-preacher-assignment.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdatePreacherAssignmentDto extends PartialType(
  CreatePreacherAssignmentDto,
) {}
