import { NestFactory } from "@nestjs/core";
import { ApiGatewayModule } from "./api-gateway.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
//import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.enableCors();
  //const configService = new ConfigService({ envFilePaths: ''})
  // Connect to RabbitMQ as a microservice
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://user:password@rabbitmq:5672'], // RabbitMQ connection URL
  //     queue: 'api_gateway_queue', // Queue name for API Gateway (optional)
  //     queueOptions: {
  //       durable: false, // Set to true if messages should survive RabbitMQ restarts
  //     },
  //   },
  // });

  const config = new DocumentBuilder()
    .setTitle("EWU APi")
    .setDescription("The EWU API description")
    .setVersion("1.0")
    .addTag("EWU")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);

  // Start the microservice
  await app.startAllMicroservices();

  app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));

  // Start the HTTP server
  await app.listen(4097);
  console.log("API Gateway is running on port 4000");
}
bootstrap();
