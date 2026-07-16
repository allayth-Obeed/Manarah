import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.announcement.findMany({
      include: {
        mosque: true,
      },
    });
  }

  async findOne(id: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        mosque: true,
      },
    });

    if (!announcement) {
      throw new NotFoundException('الإعلان غير موجود');
    }

    return announcement;
  }

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: createAnnouncementDto,
    });
  }

  async update(
    id: number,
    updateAnnouncementDto: Partial<CreateAnnouncementDto>,
  ) {
    return this.prisma.announcement.update({
      where: { id },
      data: updateAnnouncementDto,
    });
  }

  async remove(id: number) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
