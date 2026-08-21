import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const UNCLASSIFIED_ACCOUNT_MAX_AGE_DAYS = 7;

// يحذف تلقائياً كل حساب "مستخدم عادي" (USER) لم يُصنَّف بعد (لم يُحدَّد دوره كخطيب/موظف ولم يُربَط
// بسجل خطيب/موظف) بعد مرور أسبوع كامل على إنشائه — حسابات لم تكتمل معالجتها تبقى بلا فائدة بقاعدة البيانات
@Injectable()
export class UsersCleanupService {
  private readonly logger = new Logger(UsersCleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeStaleUnclassifiedUsers() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - UNCLASSIFIED_ACCOUNT_MAX_AGE_DAYS);

    // ADDED: نستثني أي حساب مرتبط فعلياً بسجل خطيب/موظف حتى لو نُسي تحديث role — حماية إضافية من حذف حساب مُستخدَم فعلياً
    const staleUsers = await this.prisma.user.findMany({
      where: {
        role: Role.USER,
        createdAt: { lt: cutoff },
        preacher: null,
        employee: null,
      },
      select: { id: true, email: true },
    });

    if (staleUsers.length === 0) return;

    await this.prisma.user.deleteMany({
      where: { id: { in: staleUsers.map((u) => u.id) } },
    });

    this.logger.log(
      `تم حذف ${staleUsers.length} حساب مستخدم عادي غير مُصنَّف بعد مرور ${UNCLASSIFIED_ACCOUNT_MAX_AGE_DAYS} أيام: ${staleUsers.map((u) => u.email).join(', ')}`,
    );
  }
}
