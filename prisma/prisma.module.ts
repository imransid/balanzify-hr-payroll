import { Module } from '@nestjs/common';
import { PrismaHrService } from './prisma-hr.service';

@Module({
  providers: [PrismaHrService],
  exports: [PrismaHrService],
})
export class PrismaModule {}
