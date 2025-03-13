import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
//import { PrismaService } from '../../../../prisma/prisma-user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from '../../../../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
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
  ],
  providers: [
    UserResolver,
    UserService,
    //PrismaService,
    JwtService,
    ConfigService,
    GoogleStrategy,
  ],
})
export class UserModule {}
