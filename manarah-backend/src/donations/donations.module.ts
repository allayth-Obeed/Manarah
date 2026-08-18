import { Module } from '@nestjs/common';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
