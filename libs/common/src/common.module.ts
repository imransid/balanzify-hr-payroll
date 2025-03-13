import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { RmqModule } from './rmq';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [DatabaseModule, ConfigModule, RmqModule],
})
export class CommonModule {}
