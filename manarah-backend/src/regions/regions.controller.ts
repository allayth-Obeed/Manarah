import { Controller, Get, UseGuards } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('regions')
@UseGuards(JwtAuthGuard) // بيانات مرجعية للقراءة فقط — أي مستخدم مسجّل يمكنه رؤيتها لتعبئة القوائم المنسدلة
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('tree')
  getTree() {
    return this.regionsService.getTree();
  }
}
