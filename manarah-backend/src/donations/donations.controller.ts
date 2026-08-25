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
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto'; // class حقيقية بدل Partial<> النوعية غير المتحقَّق منها
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // تفعيل التحقق من الدور بعد JWT
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('donations')
@UseGuards(JwtAuthGuard) // جميع مسارات التبرعات محمية بـ JWT
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard) // تسجيل تبرع (بيانات مالية): ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) // تعديل تبرع: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(id, updateDonationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // حذف تبرع: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.remove(id);
  }
}
