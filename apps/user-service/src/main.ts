import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { UserServiceModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5673'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
