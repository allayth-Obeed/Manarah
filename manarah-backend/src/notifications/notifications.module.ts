import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsGateway } from './notifications.gateway';
import { MosqueNotificationsService } from './mosque-notifications.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [NotificationsGateway, MosqueNotificationsService],
  exports: [NotificationsGateway, MosqueNotificationsService],
})
export class NotificationsModule {}
