import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.donation.findMany({
      include: {
        mosque: true,
      },
    });
  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        mosque: true,
      },
    });

    if (!donation) {
      throw new NotFoundException('التبرع غير موجود');
    }

    return donation;
  }

  async create(createDonationDto: CreateDonationDto) {
    // التحقق من وجود المسجد أولاً بدل ترك خطأ FK خام يتسرب كـ 500 عام
    const mosque = await this.prisma.mosque.findUnique({
      where: { id: createDonationDto.mosqueId },
    });
    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }

    return this.prisma.donation.create({
      data: createDonationDto,
    });
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    // التحقق من وجود التبرع قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.donation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('التبرع غير موجود');
    }

    return this.prisma.donation.update({
      where: { id },
      data: updateDonationDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود التبرع قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.donation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('التبرع غير موجود');
    }

    return this.prisma.donation.delete({
      where: { id },
    });
  }
}
