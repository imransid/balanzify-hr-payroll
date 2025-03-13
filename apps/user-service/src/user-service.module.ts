import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
// import { join } from 'path';
import { UserServiceController } from './user-service.controller';
//import { UserService } from './user/user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
//import { PrismaService } from '../../../prisma/prisma-user.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
imports: [  
    UserModule,
    PrismaModule,
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
     })
    }),
  ],
  controllers: [UserServiceController],
  providers: [
    UserService, 
    JwtService,
    //PrismaService,
    ConfigService  
  ],
})
export class UserServiceModule {}
