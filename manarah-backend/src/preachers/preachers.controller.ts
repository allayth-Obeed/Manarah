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
import { PreachersService } from './preachers.service';
import { CreatePreacherDto } from './dto/create-preacher.dto';
import { UpdatePreacherDto } from './dto/update-preacher.dto'; // class حقيقية بدل Partial<> النوعية غير المتحقَّق منها
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // تفعيل التحقق من الدور بعد JWT
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('preachers')
@UseGuards(JwtAuthGuard) // جميع مسارات الخطباء محمية بـ JWT
export class PreachersController {
  constructor(private readonly preachersService: PreachersService) {}

  @Get()
  findAll() {
    return this.preachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preachersService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard) // إضافة داعية: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  create(@Body() createPreacherDto: CreatePreacherDto) {
    return this.preachersService.create(createPreacherDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) // تعديل داعية: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreacherDto: UpdatePreacherDto,
  ) {
    return this.preachersService.update(id, updatePreacherDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // حذف داعية: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preachersService.remove(id);
  }
}
