import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, IsEnum } from 'class-validator';
import { MaintenanceStatus } from '@prisma/client';
import { CreateMaintenanceTicketDto } from './create-maintenance.dto';

// class حقيقية (وليست Partial<> النوعية فقط) حتى يعمل ValidationPipe فعلياً على PATCH
export class UpdateMaintenanceTicketDto extends PartialType(
  CreateMaintenanceTicketDto,
) {
  @IsOptional()
  @IsEnum(MaintenanceStatus, { message: 'حالة التذكرة غير صالحة' })
  status?: MaintenanceStatus;

  @IsOptional()
  @IsInt({ message: 'الموظف المسؤول غير صالح' })
  assignedToId?: number;
}
