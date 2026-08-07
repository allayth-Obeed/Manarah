import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { EmployeesModule } from '../employees/employees.module';
import { MosquesModule } from '../mosques/mosques.module'; // لازم لتقرير المساجد الجديد
import { DonationsModule } from '../donations/donations.module'; // ADDED: لازم لتقرير التبرعات الجديد

@Module({
  imports: [EmployeesModule, MosquesModule, DonationsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
