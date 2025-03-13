import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaClient } from '../prisma/generated/user'

@Injectable()
export class PrismaUserService extends PrismaClient implements OnModuleInit {
  [x: string]: any
  async onModuleInit() {
    // Note: this is optional
    await this.$connect()
  }
}