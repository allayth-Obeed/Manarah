import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

// إشعارات المستخدم الحالي الشخصية فقط — لا حاجة لدور خاص، كل مستخدم يرى ويدير إشعاراته
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  private userId(req: Request) {
    return (req.user as any).userId as number;
  }

  @Get()
  findMine(@Req() req: Request) {
    return this.notificationsService.findMine(this.userId(req));
  }

  @Patch('read-all')
  markAllRead(@Req() req: Request) {
    return this.notificationsService.markAllRead(this.userId(req));
  }

  @Patch(':id/read')
  markRead(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markRead(this.userId(req), id);
  }
}
