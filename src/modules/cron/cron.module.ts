import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TweeterService } from '../tweeter/tweeter.service';

@Module({
  providers: [CronService, TweeterService],
})
export class CronModule {}
