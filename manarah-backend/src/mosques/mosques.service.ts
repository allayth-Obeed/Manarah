import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';

// ADDED: سلسلة العلاقات الجغرافية الكاملة (موقع → منطقة فرعية → منطقة → محافظة) تُرفق مع كل مسجد
const locationInclude = {
  location: {
    include: {
      subRegion: {
        include: {
          region: {
            include: {
              province: true,
            },
          },
        },
      },
    },
  },
} as const;

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
        ...locationInclude,
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
        ...locationInclude,
      },
    });

    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود');
    }

    return mosque;
  }

  // ADDED: يتحقق من وجود الموقع الجغرافي فعلياً قبل ربط المسجد به
  private async assertLocationExists(locationId?: number) {
    if (locationId == null) return;
    const location = await this.prisma.location.findUnique({ where: { id: locationId } });
    if (!location) {
      throw new NotFoundException('الموقع الجغرافي المحدد غير موجود');
    }
  }

  async create(createMosqueDto: CreateMosqueDto) {
    await this.assertLocationExists(createMosqueDto.locationId);
    return this.prisma.mosque.create({
      data: createMosqueDto,
    });
  }

  async update(id: number, updateMosqueDto: UpdateMosqueDto) {
    // التحقق من وجود المسجد قبل التحديث لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.mosque.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('المسجد غير موجود');
    }

    await this.assertLocationExists(updateMosqueDto.locationId);

    return this.prisma.mosque.update({
      where: { id },
      data: updateMosqueDto,
    });
  }

  async remove(id: number) {
    // التحقق من وجود المسجد قبل الحذف لتجنب أخطاء Prisma غير المعالجة
    const existing = await this.prisma.mosque.findUnique({
      where: { id },
      include: {
        preachers: true,
        announcements: true,
        donations: true,
      },
    });
    if (!existing) {
      throw new NotFoundException('المسجد غير موجود');
    }

    // MODIFIED: حذف المسجد يحرّر الخطباء منه تلقائياً (يحذف تعيينهم بهذا المسجد فقط) بدل رفض الحذف —
    // هذا لا يحذف سجل الخطيب نفسه (Preacher) إطلاقاً، فقط رابط تعيينه بهذا المسجد تحديداً
    // نبقي الرفض للإعلانات والتبرعات لأنها سجلات تاريخية/مالية لا يجوز محوها صامتاً
    if (existing.announcements.length || existing.donations.length) {
      const parts: string[] = [];
      if (existing.announcements.length) parts.push(`${existing.announcements.length} إعلان`);
      if (existing.donations.length) parts.push(`${existing.donations.length} تبرع`);
      throw new ConflictException(
        `لا يمكن حذف هذا المسجد لارتباطه بـ ${parts.join(' و')}. يجب حذف أو نقل هذه السجلات أولاً.`,
      );
    }

    // ADDED: عملية واحدة ذرّية (transaction) — إمّا يتحرر الخطباء ويُحذف المسجد معاً، أو لا يحدث شيء عند أي خطأ
    return this.prisma.$transaction(async (tx) => {
      if (existing.preachers.length) {
        await tx.preacherAssignment.deleteMany({ where: { mosqueId: id } });
      }
      return tx.mosque.delete({ where: { id } });
    });
  }
}
