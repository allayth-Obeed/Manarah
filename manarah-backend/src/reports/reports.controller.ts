import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; // بيانات حساسة (رواتب) — لازم تقييد بالدور أيضاً
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard) // جميع مسارات التقارير محمية بـ JWT + الدور
@Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('employees/download')
  async downloadEmployeesReport(@Res() res: Response) {
    // نقل توليد CSV إلى ReportsService (مع إصلاح الهروب من الفواصل/الاقتباسات)
    const csvContent = await this.reportsService.generateEmployeesCsv();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=employees_report.csv');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    return res.send(csvContent);
  }

  @Get('mosques/download')
  async downloadMosquesReport(@Res() res: Response) {
    // تقرير مساجد جديد بنفس نمط تقرير الموظفين
    const csvContent = await this.reportsService.generateMosquesCsv();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=mosques_report.csv');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    return res.send(csvContent);
  }

  // ADDED: تقرير تبرعات جديد — يفعّل زر "تحميل تقرير التبرعات" الذي كان مربوطاً بالخطأ بديالوج إضافة تبرع
  @Get('donations/download')
  async downloadDonationsReport(@Res() res: Response) {
    const csvContent = await this.reportsService.generateDonationsCsv();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=donations_report.csv');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    return res.send(csvContent);
  }
}
