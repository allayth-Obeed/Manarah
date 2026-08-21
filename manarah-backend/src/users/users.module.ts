import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCleanupService } from './users-cleanup.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersCleanupService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
