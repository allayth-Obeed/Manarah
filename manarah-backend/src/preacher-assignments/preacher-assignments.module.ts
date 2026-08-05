import { Module } from '@nestjs/common';
import { PreacherAssignmentsController } from './preacher-assignments.controller';
import { PreacherAssignmentsService } from './preacher-assignments.service';

@Module({
  controllers: [PreacherAssignmentsController],
  providers: [PreacherAssignmentsService],
  exports: [PreacherAssignmentsService],
})
export class PreacherAssignmentsModule {}
