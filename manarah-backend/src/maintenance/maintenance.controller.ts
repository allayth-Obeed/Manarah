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
} from '@nestjs/common';
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
  @UseGuards(RolesGuard) // إسناد/تغيير حالة/تعديل تذكرة: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceTicketDto,
  ) {
    return this.maintenanceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // حذف تذكرة: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.remove(id);
  }
}
