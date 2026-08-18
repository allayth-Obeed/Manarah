import { Module } from '@nestjs/common';
import { PreacherAssignmentsController } from './preacher-assignments.controller';
import { PreacherAssignmentsService } from './preacher-assignments.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [PreacherAssignmentsController],
  providers: [PreacherAssignmentsService],
  exports: [PreacherAssignmentsService],
})
export class PreacherAssignmentsModule {}
