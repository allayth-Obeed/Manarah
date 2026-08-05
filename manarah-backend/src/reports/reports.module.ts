import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [EmployeesModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
