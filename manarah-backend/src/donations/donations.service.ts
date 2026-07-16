import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';

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
    return this.prisma.donation.create({
      data: createDonationDto,
    });
  }

  async update(
    id: number,
    updateDonationDto: Partial<CreateDonationDto>,
  ) {
    return this.prisma.donation.update({
      where: { id },
      data: updateDonationDto,
    });
  }

  async remove(id: number) {
    return this.prisma.donation.delete({
      where: { id },
    });
  }
}
