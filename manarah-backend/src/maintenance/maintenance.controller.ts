import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceTicketDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceTicketDto } from './dto/update-maintenance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('maintenance-tickets')
@UseGuards(JwtAuthGuard) // جميع مسارات الصيانة محمية بـ JWT
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  // إبلاغ عن عطل/شكوى متاح لأي مستخدم مسجَّل دخول (إمام/موظف قد يبلّغ عن عطل بمسجده)
  create(@Body() dto: CreateMaintenanceTicketDto) {
    return this.maintenanceService.create(dto);
  }

  @Patch(':id')
  // ADDED: التعديل الكامل (إسناد/عنوان/مسجد) يبقى ADMIN/MANAGER فقط، لكن الموظف المُسنَدة إليه التذكرة
  // يقدر يحدّث حالتها هو بنفسه — الفحص الفعلي بحسب هوية المستخدم وليس دوره فقط، فهو بالخدمة (Service) وليس هنا
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceTicketDto,
    @Req() req: Request,
  ) {
    const actingUser = req.user as { userId: number; role: Role };
    return this.maintenanceService.update(id, dto, actingUser);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // حذف تذكرة: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.remove(id);
  }
}
