import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../prisma/generated/hr';

@Injectable()
export class PrismaHrService extends PrismaClient implements OnModuleInit {
  [x: string]: any;
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
}
