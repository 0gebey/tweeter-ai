import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ConfigModule } from '@nestjs/config';
import { TweeterService } from '../tweeter/tweeter.service';
import { ScraperController } from './scraper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from '../../schemas/news';
import { SportsNews, SportsNewsSchema } from '../../schemas/sportsNews';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema,
      },
      {
        name: SportsNews.name,
        schema: SportsNewsSchema,
      },
    ]),
  ],
  providers: [ScraperService, TweeterService],
  controllers: [ScraperController],
})
export class ScraperModule {}
