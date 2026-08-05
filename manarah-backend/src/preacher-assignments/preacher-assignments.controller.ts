import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { PreacherAssignmentsService } from './preacher-assignments.service'
import { CreatePreacherAssignmentDto } from './dto/create-preacher-assignment.dto'
import { UpdatePreacherAssignmentDto } from './dto/update-preacher-assignment.dto' // class حقيقية بدل Partial<> النوعية غير المتحقَّق منها
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard' // تفعيل التحقق من الدور بعد JWT
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'

@Controller('preacher-assignments')
@UseGuards(JwtAuthGuard)
export class PreacherAssignmentsController {
  constructor(private readonly preacherAssignmentsService: PreacherAssignmentsService) {}

  @Get()
  findAll() {
    return this.preacherAssignmentsService.findAll()
  }

  @Get('conflict-check')
  checkConflict(
    @Query('preacherId', ParseIntPipe) preacherId: number,
    @Query('date') date: string
  ) {
    // رفض أي تاريخ غير صالح بدل تمريره كـ NaN بصمت للاستعلام
    if (!date || Number.isNaN(Date.parse(date))) {
      throw new BadRequestException('تاريخ غير صالح')
    }
    return this.preacherAssignmentsService.checkPreacherConflict(preacherId, date)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preacherAssignmentsService.findOne(id)
  }

  @Post()
  @UseGuards(RolesGuard) // إسناد داعية لمسجد: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createPreacherAssignmentDto: CreatePreacherAssignmentDto) {
    return this.preacherAssignmentsService.create(createPreacherAssignmentDto)
  }

  @Patch(':id')
  @UseGuards(RolesGuard) // تعديل إسناد: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreacherAssignmentDto: UpdatePreacherAssignmentDto
  ) {
    return this.preacherAssignmentsService.update(id, updatePreacherAssignmentDto)
  }

  @Delete(':id')
  @UseGuards(RolesGuard) // إلغاء إسناد: ADMIN/MANAGER فقط
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preacherAssignmentsService.remove(id)
  }
}
