import { Module } from '@nestjs/common';
import { PrismaHrService } from './prisma-hr.service';
import { PrismaUserService } from './prisma-user.service';

@Module({
  providers: [PrismaUserService, PrismaHrService],
  exports: [PrismaUserService, PrismaHrService],
})
export class PrismaModule {}
