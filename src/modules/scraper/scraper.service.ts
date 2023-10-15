import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { TweeterService } from '../tweeter/tweeter.service';
import { News, NewsDocument } from '../../schemas/news';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsDto } from '../../dtos/news';

@Injectable()
export class ScraperService {
  constructor(
    private configService: ConfigService,
    private readonly tweeterService: TweeterService,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  @Cron('*/30 * * * *')
  async newsScraper() {
    try {
      const newsInTR = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=tr&category=politics&apiKey=' +
          this.configService.get('news.apiKey'),
      );
      const lastNews = newsInTR.data.articles[
        newsInTR.data.articles.length - 1
      ] as NewsDto;
      // Get last news in DB
      const lastNewsInDB = await this.newsModel.findOne().sort({ _id: -1 });
      if (lastNewsInDB?.title && lastNews.title === lastNewsInDB.title) {
        console.log('No new news => ', lastNews.title);
        return;
      } else {
        console.log('New news', lastNews.title);
        const tweet = await this.tweeterService.createTweet(lastNews);
        console.log('Tweet created => ', tweet);
        const news = new this.newsModel(lastNews);
        const savedNews = await news.save();
        console.log('News saved => ', savedNews);
        return savedNews;
      }
    } catch (error) {
      console.error('ERROR WHILE RETRIEVING THE NEWS', error);
    }
  }
}
