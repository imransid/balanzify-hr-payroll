import { NestFactory } from '@nestjs/core';
import { PageBuilderModule } from './page-builder.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PageBuilderModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5673'],
        queue: 'page_builder_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
