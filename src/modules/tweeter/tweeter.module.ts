import { Module } from '@nestjs/common';
import { TweeterService } from './tweeter.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TweeterService],
  exports: [TweeterService],
})
export class TweeterModule {}
