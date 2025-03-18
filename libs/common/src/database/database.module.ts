import { Module } from '@nestjs/common';
import { PrismaHrService } from '../../../../prisma/prisma-hr.service';

@Module({
  providers: [PrismaHrService],
})
export class DatabaseModule {}
