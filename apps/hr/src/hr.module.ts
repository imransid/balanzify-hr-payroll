import { Module } from "@nestjs/common";
import { HrController } from "./hr.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "../../../prisma/prisma.module";
import { ComponentsModule } from "./components/components.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
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
          host: configService.get("EMAIL_HOST"),
          port: configService.get("EMAIL_PORT"),
          auth: {
            user: configService.get("EMAIL_USERNAME"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
      serveStaticOptions: {
        extensions: ["jpg", "jpeg", "png", "gif"],
        index: false,
      },
    }),
    ComponentsModule,
  ],
  controllers: [HrController],
  providers: [JwtService, ConfigService],
})
export class HrModule {}
