import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { ScraperService } from '../scraper/scraper.service';
import { TweeterService } from '../tweeter/tweeter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from '../../schemas/news';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema,
      },
    ]),
  ],
  providers: [CronService, ScraperService, TweeterService],
  controllers: [CronController],
})
export class CronModule {}
