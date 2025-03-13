import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaClient } from './generated/page-builder'

@Injectable()
export class PrismaPageBuilderService extends PrismaClient implements OnModuleInit {
  [x: string]: any
  async onModuleInit() {
    // Note: this is optional
    await this.$connect()
  }
}