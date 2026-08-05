import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
