import { Module } from '@nestjs/common';
import { PageBuilderController } from './page-builder.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ComponentsModule } from './components/components.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
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
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        extensions: ['jpg', 'jpeg', 'png', 'gif'],
        index: false,
      },
    }),
    ComponentsModule,
  ],
  controllers: [PageBuilderController],
  providers: [JwtService, ConfigService],
})
export class PageBuilderModule {}
