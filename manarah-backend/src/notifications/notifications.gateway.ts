import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// بوابة بث لحظي عامة (بدرجة واحدة من العملاء) — لا حاجة لاستهداف مستخدم محدد،
// كل عميل متصل ومُصادَق بـ JWT صالح يستقبل نفس أحداث النظام (تبرع جديد، تذكرة صيانة، تكليف خطيب)
@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ||
        (client.handshake.query?.token as string | undefined);

      if (!token) {
        throw new Error('لا يوجد توكن مرفق مع الاتصال');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.data.user = payload;
      // ADDED: كل عميل ينضم لغرفة خاصة بمعرّف مستخدمه — تسمح بإرسال إشعارات موجَّهة (مثل موظفي مسجد محدد)
      // بدل الاكتفاء بالبث العام لكل المتصلين
      client.join(this.roomForUser(payload.sub));
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect() {
    // لا حاجة لأي تنظيف — socket.io يغادر كل الغرف تلقائياً عند فصل الاتصال
  }

  private roomForUser(userId: number) {
    return `user:${userId}`;
  }

  // بث عام لكل العملاء المتصلين (تبرعات جديدة، تعيينات خطباء... أحداث تهم لوحة التحكم عموماً)
  // ADDED: excludeUserIds تمنع ازدواج التسليم لمن استلم نفس الحدث مسبقاً عبر إرسال موجَّه (مثل موظفي مسجد التذكرة)
  emitEvent(event: string, payload: unknown, excludeUserIds: number[] = []) {
    if (excludeUserIds.length === 0) {
      this.server?.emit(event, payload);
      return;
    }
    this.server?.except(excludeUserIds.map((id) => this.roomForUser(id))).emit(event, payload);
  }

  // ADDED: إرسال موجَّه لمستخدم واحد فقط عبر غرفته الخاصة
  emitToUser(userId: number, event: string, payload: unknown) {
    this.server?.to(this.roomForUser(userId)).emit(event, payload);
  }

  // ADDED: إرسال موجَّه لمجموعة مستخدمين (مثل كل موظفي مسجد معيّن)
  emitToUsers(userIds: number[], event: string, payload: unknown) {
    userIds.forEach((userId) => this.emitToUser(userId, event, payload));
  }
}
