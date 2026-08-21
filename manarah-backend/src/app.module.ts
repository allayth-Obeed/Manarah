import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; // ADDED: يفعّل @Cron لتنظيف الحسابات غير المصنَّفة تلقائياً
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MosquesModule } from './mosques/mosques.module';
import { PreachersModule } from './preachers/preachers.module';
import { EmployeesModule } from './employees/employees.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { DonationsModule } from './donations/donations.module';
import { ReportsModule } from './reports/reports.module';
import { PreacherAssignmentsModule } from './preacher-assignments/preacher-assignments.module';
import { RegionsModule } from './regions/regions.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    MosquesModule,
    PreachersModule,
    EmployeesModule,
    AnnouncementsModule,
    DonationsModule,
    ReportsModule,
    PreacherAssignmentsModule,
    RegionsModule,
    MaintenanceModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
