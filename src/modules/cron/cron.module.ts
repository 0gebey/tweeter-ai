import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TweeterService } from '../tweeter/tweeter.service';
import { CronController } from './cron.controller';

@Module({
  providers: [CronService, TweeterService],
  controllers: [CronController],
})
export class CronModule {}
