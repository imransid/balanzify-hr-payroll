import { Module } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma-user.service';

@Module({
    providers: [PrismaService]
})
export class DatabaseModule {}
