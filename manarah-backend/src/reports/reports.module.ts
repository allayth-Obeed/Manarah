import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { EmployeesModule } from '../employees/employees.module';
import { MosquesModule } from '../mosques/mosques.module'; // لازم لتقرير المساجد الجديد

@Module({
  imports: [EmployeesModule, MosquesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
