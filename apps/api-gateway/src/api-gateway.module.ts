import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';
import { ApiGatewayController } from './api-gateway.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PageBuilderModule } from 'apps/page-builder/src/page-builder.module';
import { Upload } from '../../../scalars/upload.scalar';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    Upload,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5673'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PAGE_BUILDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5673'],
          queue: 'page_builder_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      //sortSchema: true,
      //typePaths: ['./**/*.graphql'],
      // definitions: {
      //   path: join(process.cwd(), '/apps/api-gateway/src/graphql.schema.ts'),
      //   outputAs: 'class',
      // },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        extensions: ['jpg', 'jpeg', 'png', 'gif'],
        index: false,
      },
    }),
    UserServiceModule,
    PageBuilderModule,
  ],
  controllers: [ApiGatewayController],
  providers: [JwtService],
})
export class ApiGatewayModule {}
