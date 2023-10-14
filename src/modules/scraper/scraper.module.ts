import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TweeterService } from '../tweeter/tweeter.service';
import { ScraperController } from './scraper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from '../../schemas/news';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema,
      },
    ]),
  ],
  providers: [ScraperService, TweeterService],
  controllers: [ScraperController],
})
export class ScraperModule {}
