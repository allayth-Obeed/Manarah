import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { MosquesService } from '../mosques/mosques.service';

const BOM = '﻿'; // BOM لدعم عرض الحروف العربية بشكل صحيح داخل Excel

// يلف القيمة بعلامات اقتباس ويضاعف أي علامة اقتباس داخلية إن احتوت القيمة
// على فاصلة أو علامة اقتباس أو سطر جديد — إصلاح لثغرة CSV غير مهروب منه سابقاً
function escapeCsvField(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly mosquesService: MosquesService,
  ) {}

  async generateEmployeesCsv(): Promise<string> {
    const employees = await this.employeesService.findAll();

    const csvHeader = ['الاسم الأول', 'الاسم الأخير', 'الوظيفة', 'القسم', 'رقم الهاتف', 'الراتب', 'تاريخ التوظيف']
      .map(escapeCsvField)
      .join(',');

    const csvRows = employees
      .map((emp: any) =>
        [emp.firstName, emp.lastName, emp.position, emp.department, emp.phone, emp.salary, emp.hireDate]
          .map(escapeCsvField)
          .join(','),
      )
      .join('\n');

    return BOM + csvHeader + '\n' + csvRows;
  }

  async generateMosquesCsv(): Promise<string> {
    const mosques = await this.mosquesService.findAll();

    const csvHeader = ['الاسم', 'العنوان', 'المدينة', 'الهاتف', 'السعة']
      .map(escapeCsvField)
      .join(',');

    const csvRows = mosques
      .map((mosque: any) =>
        [mosque.name, mosque.address, mosque.city, mosque.phone, mosque.capacity]
          .map(escapeCsvField)
          .join(','),
      )
      .join('\n');

    return BOM + csvHeader + '\n' + csvRows;
  }
}
