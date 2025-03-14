import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram.module';

async function bootstrap() {
  const app = await NestFactory.create(TelegramModule);
  await app.listen(4077);

  app.enableCors();
}
bootstrap();
