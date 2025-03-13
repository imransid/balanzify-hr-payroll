import { Module } from '@nestjs/common';
import { PrismaPageBuilderService } from './prisma-page-builder.service';
import { PrismaUserService } from './prisma-user.service';


@Module({
  providers: [
    PrismaUserService, 
    PrismaPageBuilderService
 ],
  exports: [
    PrismaUserService, 
    PrismaPageBuilderService
 ],
})
export class PrismaModule {}