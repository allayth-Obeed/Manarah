import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';

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

  async update(id: number, updateMosqueDto: UpdateMosqueDto) {
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
    // نجلب أعداد السجلات المرتبطة أيضاً هنا: بدون onDelete: Cascade في الـ schema، حذف مسجد له
    // تعيينات خطباء/إعلانات/تبرعات مرتبطة كان يفشل بخطأ قيد مفتاح أجنبي خام (500) غير مفهوم للمستخدم
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

    const relatedCounts = {
      assignments: existing.preachers.length,
      announcements: existing.announcements.length,
      donations: existing.donations.length,
    };

    if (relatedCounts.assignments || relatedCounts.announcements || relatedCounts.donations) {
      // رفض واضح بدل السماح بحذف يمحو صامتاً سجلات تبرعات/إعلانات تاريخية، أو ترك خطأ 500 غامض
      const parts: string[] = [];
      if (relatedCounts.assignments) parts.push(`${relatedCounts.assignments} تعيين خطيب`);
      if (relatedCounts.announcements) parts.push(`${relatedCounts.announcements} إعلان`);
      if (relatedCounts.donations) parts.push(`${relatedCounts.donations} تبرع`);
      throw new ConflictException(
        `لا يمكن حذف هذا المسجد لارتباطه بـ ${parts.join(' و')}. يجب حذف أو نقل هذه السجلات أولاً.`,
      );
    }

    return this.prisma.mosque.delete({
      where: { id },
    });
  }
}
