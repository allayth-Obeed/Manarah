import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { NotificationsGateway } from '../notifications/notifications.gateway'
import { CreatePreacherAssignmentDto } from './dto/create-preacher-assignment.dto'
import { UpdatePreacherAssignmentDto } from './dto/update-preacher-assignment.dto'

@Injectable()
export class PreacherAssignmentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
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

      // ADDED: بث لحظي عند تثبيت تكليف خطيب جديد
      this.notifications.emitEvent('assignment.created', {
        id: assignment.id,
        preacherName: `${assignment.preacher.firstName} ${assignment.preacher.lastName}`,
        mosqueName: assignment.mosque.name,
        role: assignment.role,
      })

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
    // التحقق من وجود التعيين قبل الحذف
    const existing = await this.prisma.preacherAssignment.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new NotFoundException('تعيين الخطيب غير موجود')
    }

    return this.prisma.preacherAssignment.delete({
      where: { id },
    })
  }
}
