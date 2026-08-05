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
} from '@nestjs/common'
import { PreacherAssignmentsService } from './preacher-assignments.service'
import { CreatePreacherAssignmentDto } from './dto/create-preacher-assignment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

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
    return this.preacherAssignmentsService.checkPreacherConflict(preacherId, date)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preacherAssignmentsService.findOne(id)
  }

  @Post()
  create(@Body() createPreacherAssignmentDto: CreatePreacherAssignmentDto) {
    return this.preacherAssignmentsService.create(createPreacherAssignmentDto)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreacherAssignmentDto: Partial<CreatePreacherAssignmentDto>
  ) {
    return this.preacherAssignmentsService.update(id, updatePreacherAssignmentDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preacherAssignmentsService.remove(id)
  }
}
