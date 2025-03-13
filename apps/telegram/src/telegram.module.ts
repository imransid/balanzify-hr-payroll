import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
