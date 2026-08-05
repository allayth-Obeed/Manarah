import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { EmployeesService } from '../employees/employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard) // جميع مسارات التقارير محمية بـ JWT
export class ReportsController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('employees/download')
  async downloadEmployeesReport(@Res() res: Response) {
    const employees = await this.employeesService.findAll();

    // إنشاء محتوى CSV مع BOM لدعم العربية في Excel
    const BOM = '\uFEFF';
    const csvHeader = 'الاسم الأول,الاسم الأخير,الوظيفة,القسم,رقم الهاتف,الراتب,تاريخ التوظيف\n';
    const csvRows = employees
      .map((emp: any) =>
        `${emp.firstName || ''},${emp.lastName || ''},${emp.position || ''},${emp.department || ''},${emp.phone || ''},${emp.salary || ''},${emp.hireDate || ''}`
      )
      .join('\n');

    const csvContent = BOM + csvHeader + csvRows;

    // إعداد الاستجابة لتنزيل الملف
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=employees_report.csv');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    return res.send(csvContent);
  }
}
