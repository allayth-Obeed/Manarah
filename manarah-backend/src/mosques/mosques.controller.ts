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
import { MosquesService } from './mosques.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto'; // class حقيقية بدل Partial<> النوعية غير المتحقَّق منها
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // تفعيل التحقق من الدور بعد JWT
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('mosques')
@UseGuards(JwtAuthGuard) // جميع مسارات المساجد محمية بـ JWT
export class MosquesController {
  constructor(private readonly mosquesService: MosquesService) {}

  @Get()
  findAll() {
    return this.mosquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mosquesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard) // إنشاء مسجد: ADMIN/MANAGER فقط، وليس أي مستخدم مسجّل
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createMosqueDto: CreateMosqueDto) {
    return this.mosquesService.create(createMosqueDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) // تعديل مسجد: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMosqueDto: UpdateMosqueDto,
  ) {
    return this.mosquesService.update(id, updateMosqueDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // حذف مسجد: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mosquesService.remove(id);
  }
}
