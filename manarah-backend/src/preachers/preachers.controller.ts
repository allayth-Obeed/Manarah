import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PreachersService } from './preachers.service';
import { CreatePreacherDto } from './dto/create-preacher.dto';

@Controller('preachers')
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
  create(@Body() createPreacherDto: CreatePreacherDto) {
    return this.preachersService.create(createPreacherDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreacherDto: Partial<CreatePreacherDto>,
  ) {
    return this.preachersService.update(id, updatePreacherDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preachersService.remove(id);
  }
}
