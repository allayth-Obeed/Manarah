import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MosquesModule } from './mosques/mosques.module';
import { PreachersModule } from './preachers/preachers.module';
import { EmployeesModule } from './employees/employees.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { DonationsModule } from './donations/donations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    AuthModule,
    UsersModule,
    MosquesModule,
    PreachersModule,
    EmployeesModule,
    AnnouncementsModule,
    DonationsModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
