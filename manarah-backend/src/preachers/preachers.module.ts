import { Module } from '@nestjs/common';
import { PreachersController } from './preachers.controller';
import { PreachersService } from './preachers.service';

@Module({
  controllers: [PreachersController],
  providers: [PreachersService],
  exports: [PreachersService],
})
export class PreachersModule {}
