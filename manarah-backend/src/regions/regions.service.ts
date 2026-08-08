import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  // شجرة التقسيم الإداري الكاملة (محافظة → منطقة → منطقة فرعية → موقع) لتعبئة القوائم المنسدلة المتتالية بالفرونت اند
  async getTree() {
    return this.prisma.province.findMany({
      orderBy: { name: 'asc' },
      include: {
        regions: {
          orderBy: { code: 'asc' },
          include: {
            subRegions: {
              orderBy: { code: 'asc' },
              include: {
                locations: {
                  orderBy: { name: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  }
}
