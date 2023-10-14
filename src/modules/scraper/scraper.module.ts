import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ConfigModule } from '@nestjs/config';
import { TweeterService } from '../tweeter/tweeter.service';
import { ScraperController } from './scraper.controller';

@Module({
  imports: [ConfigModule],
  providers: [ScraperService, TweeterService],
  controllers: [ScraperController],
})
export class ScraperModule {}
