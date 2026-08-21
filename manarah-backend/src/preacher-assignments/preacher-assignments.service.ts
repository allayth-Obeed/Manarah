import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { NotificationsGateway } from '../notifications/notifications.gateway'
import { NotificationsService } from '../notifications/notifications.service'
import { CreatePreacherAssignmentDto } from './dto/create-preacher-assignment.dto'
import { UpdatePreacherAssignmentDto } from './dto/update-preacher-assignment.dto'

// نص عربي مقروء لتاريخ التكليف (يوم الأسبوع + التاريخ) — يُستخدم برسالة إشعار الخطيب المُكلَّف تحديداً
const formatAssignmentDate = (date: Date) =>
  date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

@Injectable()
export class PreacherAssignmentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
    private notificationsService: NotificationsService,
  ) {}

  private buildDayRange(dateInput?: string) {
    const base = dateInput ? new Date(dateInput) : new Date()
    const startOfDay = new Date(base)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(base)
    endOfDay.setHours(23, 59, 59, 999)

    return { startOfDay, endOfDay }
  }

  async findAll() {
    return this.prisma.preacherAssignment.findMany({
      include: {
        preacher: true,
        mosque: true,
      },
    })
  }

  async findOne(id: number) {
    const assignment = await this.prisma.preacherAssignment.findUnique({
      where: { id },
      include: {
        preacher: true,
        mosque: true,
      },
    })

    if (!assignment) {
      throw new NotFoundException('تعيين الخطيب غير موجود')
    }

    return assignment
  }

  async checkPreacherConflict(preacherId: number, date?: string) {
    const { startOfDay, endOfDay } = this.buildDayRange(date)

    // MODIFIED: التعارض الحقيقي محصور بتكليفات "خطيب الجمعة" (KHATIB) فقط — دور الإمام تكليف دائم
    // ويكون طبيعياً أن يخدم أكثر من مسجد، بينما خطبة الجمعة لا يمكن أن تتزامن لنفس الشخص بنفس اليوم
    const conflicts = await this.prisma.preacherAssignment.findMany({
      where: {
        preacherId,
        isActive: true,
        role: 'KHATIB',
        startDate: {
          lte: endOfDay,
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: startOfDay,
            },
          },
        ],
      },
      include: {
        mosque: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    return {
      hasConflict: conflicts.length > 0,
      conflictCount: conflicts.length,
      date: startOfDay.toISOString(),
      conflicts,
    }
  }

  async create(createPreacherAssignmentDto: CreatePreacherAssignmentDto) {
    // التحقق من وجود الخطيب
    const preacher = await this.prisma.preacher.findUnique({
      where: { id: createPreacherAssignmentDto.preacherId },
    })
    if (!preacher) {
      throw new NotFoundException('الخطيب غير موجود')
    }

    // التحقق من وجود المسجد
    const mosque = await this.prisma.mosque.findUnique({
      where: { id: createPreacherAssignmentDto.mosqueId },
    })
    if (!mosque) {
      throw new NotFoundException('المسجد غير موجود')
    }

    try {
      const assignment = await this.prisma.preacherAssignment.create({
        data: createPreacherAssignmentDto,
        include: {
          preacher: true,
          mosque: true,
        },
      })

      // ADDED: إشعار شخصي موجَّه ومحفوظ للخطيب المُكلَّف نفسه — يصله حتى لو لم يكن متصلاً لحظة التكليف
      let notifiedUserId: number | null = null
      if (assignment.preacher.userId) {
        const dateLabel = formatAssignmentDate(new Date(assignment.startDate))
        const message =
          assignment.role === 'IMAM'
            ? `تم تكليفك كإمام دائم في مسجد ${assignment.mosque.name} اعتباراً من ${dateLabel}`
            : `تم تكليفك بخطبة الجمعة في مسجد ${assignment.mosque.name} بتاريخ ${dateLabel}`

        const saved = await this.notificationsService.createForUser(
          assignment.preacher.userId,
          'assignment',
          message,
        )
        this.notifications.emitToUser(assignment.preacher.userId, 'notification.new', saved)
        notifiedUserId = assignment.preacher.userId
      }

      // بث عام يصل لبقية المسؤولين المتصلين (لوحة التحكم الإدارية) — مع استثناء الخطيب المُكلَّف نفسه
      // (استلم رسالته الشخصية الموجَّهة أعلاه، فبثّ نفس الحدث له مجدداً بصيغة عامة يكون مربكاً ومكرَّراً)
      this.notifications.emitEvent(
        'assignment.created',
        {
          id: assignment.id,
          preacherName: `${assignment.preacher.firstName} ${assignment.preacher.lastName}`,
          mosqueName: assignment.mosque.name,
          role: assignment.role,
        },
        notifiedUserId ? [notifiedUserId] : [],
      )

      return assignment
    } catch (error) {
      // التحقق من تكرار التعيين (unique constraint على preacherId + mosqueId)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('هذا الخطيب مُعيَّن بالفعل في هذا المسجد')
      }
      throw error
    }
  }

  async update(id: number, updatePreacherAssignmentDto: UpdatePreacherAssignmentDto) {
    // التحقق من وجود التعيين قبل التحديث
    const existing = await this.prisma.preacherAssignment.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new NotFoundException('تعيين الخطيب غير موجود')
    }

    return this.prisma.preacherAssignment.update({
      where: { id },
      data: updatePreacherAssignmentDto,
      include: {
        preacher: true,
        mosque: true,
      },
    })
  }

  async remove(id: number) {
    // التحقق من وجود التعيين قبل الحذف — يشمل preacher/mosque لإرسال إشعار إنهاء التكليف بعد الحذف
    const existing = await this.prisma.preacherAssignment.findUnique({
      where: { id },
      include: { preacher: true, mosque: true },
    })
    if (!existing) {
      throw new NotFoundException('تعيين الخطيب غير موجود')
    }

    const removed = await this.prisma.preacherAssignment.delete({
      where: { id },
    })

    // ADDED: إشعار شخصي للخطيب بانتهاء تكليفه بهذا المسجد (مثلاً بعد "إنهاء التكليف" اليدوي)
    if (existing.preacher.userId) {
      const message = `تم إنهاء تكليفك في مسجد ${existing.mosque.name}`
      const saved = await this.notificationsService.createForUser(
        existing.preacher.userId,
        'assignment',
        message,
      )
      this.notifications.emitToUser(existing.preacher.userId, 'notification.new', saved)
    }

    return removed
  }
}
