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
      const last5News = newsInTR.data.articles.slice(-5) as NewsDto[];
      // Get last 5 news in DB
      const lastNewsInDB = await this.newsModel
        .find()
        .sort({ _id: -1 })
        .limit(5)
        .exec();
      // If last 5 news in DB are the same with the last 5 news in API, do nothing
      if (
        lastNewsInDB.length > 0 &&
        lastNewsInDB.every(
          (news, index) => news.title === last5News[index].title,
        )
      ) {
        console.log('No new news');
        return;
      } else {
        // Else, save the new news in DB and tweet about it if it is about politics
        last5News.forEach(async (news: NewsDto) => {
          // If the news is already in DB, do nothing
          if (lastNewsInDB.some((newsInDB) => newsInDB.title === news.title)) {
            console.log('News already in DB', news.title);
            return;
          }
          // Else, save the news in DB
          const createdNews = new this.newsModel(news);
          const savedNews = await createdNews.save();
          console.log('News saved => ', savedNews);
          // Check if the news is about politics
          const isPolitical = await this.tweeterService.isTheNewsAboutPolitics(
            news,
          );
          // If it is, tweet about it
          console.log(
            'isPolitical => ',
            isPolitical,
            isPolitical.toLowerCase() === 'yes',
          );
          if (isPolitical?.toLowerCase() === 'yes') {
            console.log('News is about politics');
            const tweet = await this.tweeterService.createTweet(news);
            console.log('Tweet created => ', tweet);
          }
        });
      }
    } catch (error) {
      console.error('ERROR WHILE RETRIEVING THE NEWS', error);
    }
  }

  async isPolitical(news: NewsDto) {
    return await this.tweeterService.isTheNewsAboutPolitics(news);
  }
}
