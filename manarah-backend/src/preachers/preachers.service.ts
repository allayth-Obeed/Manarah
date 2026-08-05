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
    try {
      const preacher = await this.prisma.preacher.create({
        data: createPreacherDto,
        include: {
          user: true,
          assignments: {
            include: { mosque: true },
          },
        },
      });
      return preacher;
    } catch (error) {
      console.error('خطأ في إنشاء الخطيب:', error);
      throw new Error('فشل في إنشاء الخطيب: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    }
  }

  async update(
    id: number,
    updatePreacherDto: Partial<CreatePreacherDto>,
  ) {
    // التحقق من وجود الخطيب قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.preacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    return this.prisma.preacher.update({
      where: { id },
      data: updatePreacherDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود الخطيب قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.preacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('الخطيب غير موجود');
    }

    return this.prisma.preacher.delete({
      where: { id },
    });
  }
}
