import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { TweeterService } from '../tweeter/tweeter.service';
import { News, NewsDocument } from '../../schemas/news';
import { SportsNews, SportsNewsDocument } from '../../schemas/sportsNews';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsDto } from '../../dtos/news';
import {
  EntertainmentNews,
  EntertainmentNewsDocument,
} from '../../schemas/entertainmentNews';
import { NewsType } from '../../enums/newsType';

@Injectable()
export class ScraperService {
  constructor(
    private configService: ConfigService,
    private readonly tweeterService: TweeterService,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(SportsNews.name)
    private sportsNewsModel: Model<SportsNewsDocument>,
    @InjectModel(EntertainmentNews.name)
    private entertainmentNewsModel: Model<EntertainmentNewsDocument>,
  ) {}

  @Cron('*/15 * * * *')
  async newsScraper() {
    try {
      const newsInTR = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=tr&apiKey=' +
          this.configService.get('news.tr.newsApiKey'),
      );
      const last10News = newsInTR.data.articles.slice(-10) as NewsDto[];
      // Get last 5 news in DB
      const lastNewsInDB = await this.newsModel
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .exec();
      // If last 5 news in DB are the same with the last 5 news in API, do nothing
      if (
        lastNewsInDB.length > 0 &&
        lastNewsInDB.every(
          (news, index) => news.title === last10News[index].title,
        )
      ) {
        console.log('No new news');
        return;
      } else {
        // Else, save the new news in DB and tweet about it if it is about politics
        last10News.forEach(async (news: NewsDto) => {
          // If the news is already in DB, do nothing
          setTimeout(async () => {
            if (
              lastNewsInDB.some((newsInDB) => newsInDB.title === news.title)
            ) {
              console.log('News already in DB', news.title);
              return;
            }
            // Else, save the news in DB
            const createdNews = new this.newsModel(news);
            const savedNews = await createdNews.save();
            console.log('News saved => ', savedNews);
            // Check if the news is about politics
            const isPolitical =
              await this.tweeterService.isTheNewsAboutPolitics(news);
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
          }, 72000);
        });
      }
    } catch (error) {
      console.error('Error in newsScraper: ', error);
    }
  }

  @Cron('*/15 * * * *')
  async sportsNewsScraper() {
    try {
      const newsInTR = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=tr&category=sports&apiKey=' +
          this.configService.get('news.tr.newsSportsApiKey'),
      );
      const last10News = newsInTR.data.articles.slice(-10) as NewsDto[];
      // Get last 5 news in DB
      const lastNewsInDB = await this.sportsNewsModel
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .exec();
      // If last 5 news in DB are the same with the last 5 news in API, do nothing
      if (
        lastNewsInDB.length > 0 &&
        lastNewsInDB.every(
          (news, index) => news.title === last10News[index].title,
        )
      ) {
        console.log('No new sports news');
        return;
      } else {
        // Else, save the new news in DB and tweet about it if it is about politics
        last10News.forEach(async (news: NewsDto) => {
          // If the news is already in DB, do nothing
          // Wait for 5 minutes between each news
          setTimeout(async () => {
            if (
              lastNewsInDB.some((newsInDB) => newsInDB.title === news.title)
            ) {
              console.log('Sports news already in DB', news.title);
              return;
            }
            // Else, save the news in DB
            const createdNews = new this.sportsNewsModel(news);
            const savedNews = await createdNews.save();
            console.log('Sports news saved => ', savedNews);

            const tweet = await this.tweeterService.createTweet(
              news,
              NewsType.Sports,
            );
            console.log('Sport tweet created => ', tweet);
          }, 72000);
        });
      }
    } catch (error) {
      console.error('Error in Sport newsScraper: ', error);
    }
  }

  @Cron('*/15 * * * *')
  async entertainmentNewsScraper() {
    try {
      const newsInTR = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=tr&category=entertainment&apiKey=' +
          this.configService.get('news.tr.newsEntertainmentApiKey'),
      );
      const last10News = newsInTR.data.articles.slice(-10) as NewsDto[];
      const lastNewsInDB = await this.entertainmentNewsModel
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .exec();

      if (
        lastNewsInDB.length > 0 &&
        lastNewsInDB.every(
          (news, index) => news.title === last10News[index].title,
        )
      ) {
        console.log('No new entertainment news');
        return;
      } else {
        last10News.forEach(async (news: NewsDto) => {
          setTimeout(async () => {
            if (
              lastNewsInDB.some((newsInDB) => newsInDB.title === news.title)
            ) {
              console.log('Entertainment news already in DB', news.title);
              return;
            }
            // Else, save the news in DB
            const createdNews = new this.entertainmentNewsModel(news);
            const savedNews = await createdNews.save();
            console.log('Entertainment news saved => ', savedNews);

            const tweet = await this.tweeterService.createTweet(
              news,
              NewsType.Entertainment,
            );
            console.log('Entertainment tweet created => ', tweet);
          }, 72000);
        });
      }
    } catch (error) {
      console.error('Error in Entertainment newsScraper: ', error);
    }
  }

  async isPolitical(news: NewsDto) {
    return await this.tweeterService.isTheNewsAboutPolitics(news);
  }
}
