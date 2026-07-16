import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreacherDto } from './dto/create-preacher.dto';

@Injectable()
export class PreachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.preacher.findMany({
      include: {
        user: true,
        assignments: {
          include: { mosque: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const preacher = await this.prisma.preacher.findUnique({
      where: { id },
      include: {
        user: true,
        assignments: {
          include: { mosque: true },
        },
      },
    });

    if (!preacher) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    return preacher;
  }

  async create(createPreacherDto: CreatePreacherDto) {
    return this.prisma.preacher.create({
      data: createPreacherDto,
    });
  }

  async update(
    id: number,
    updatePreacherDto: Partial<CreatePreacherDto>,
  ) {
    return this.prisma.preacher.update({
      where: { id },
      data: updatePreacherDto,
    });
  }

  async remove(id: number) {
    return this.prisma.preacher.delete({
      where: { id },
    });
  }
}
