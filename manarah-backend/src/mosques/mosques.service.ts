import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';

@Injectable()
export class MosquesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mosque.findMany({
      include: {
        preachers: {
          include: {
            preacher: true,
          },
        },
        announcements: true,
        donations: true,
      },
    });
  }

  async findOne(id: number) {
    const mosque = await this.prisma.mosque.findUnique({
      where: { id },
      include: {
        preachers: {
          include: {
            preacher: true,
          },
        },
        announcements: true,
        donations: true,
      },
    });

    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }

    return mosque;
  }

  async create(createMosqueDto: CreateMosqueDto) {
    return this.prisma.mosque.create({
      data: createMosqueDto,
    });
  }

  async update(id: number, updateMosqueDto: Partial<CreateMosqueDto>) {
    // التحقق من وجود المسجد قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.mosque.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('المسجد غير موجود');
    }

    return this.prisma.mosque.update({
      where: { id },
      data: updateMosqueDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود المسجد قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.mosque.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('المسجد غير موجود');
    }

    return this.prisma.mosque.delete({
      where: { id },
    });
  }
}
