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
import { MosquesService } from './mosques.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';

@Controller('mosques')
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
  create(@Body() createMosqueDto: CreateMosqueDto) {
    return this.mosquesService.create(createMosqueDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMosqueDto: Partial<CreateMosqueDto>,
  ) {
    return this.mosquesService.update(id, updateMosqueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mosquesService.remove(id);
  }
}
