import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TweeterService } from '../tweeter/tweeter.service';
import { News, NewsDocument } from '../../schemas/news';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsDto } from '../../dtos/news';
import { NewsCategory } from '../../enums/newsCategory';
import { isNewNewsPresent, isTimeToTweet } from '../../util/utils';
import { NewsCountry } from '../../enums/newsCountry';
import { NewsTimeZone } from '../../enums/newsTimeZone';

@Injectable()
export class ScraperService {
  constructor(
    private configService: ConfigService,
    private readonly tweeterService: TweeterService,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  async newsScraper(
    country: NewsCountry,
    newsTimeZone: NewsTimeZone,
    category: NewsCategory,
  ) {
    console.log('Scraping news for =>', country, category, newsTimeZone);
    try {
      if (!isTimeToTweet(newsTimeZone)) {
        console.log('Not the time to tweet.');
        return;
      }

      const newsResponse = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=` +
          this.configService.get(`news.${country}.${category}NewsApiKey`),
      );

      const newsArticles: NewsDto[] = newsResponse.data.articles.slice(-10);
      const lastNewsInDB: News[] = await this.newsModel
        .find()
        .where('country')
        .equals(country)
        .where('category')
        .equals(category)
        .sort({ _id: -1 })
        .limit(10)
        .exec();

      /* console.log('lastNewsInDB =>', lastNewsInDB); */

      if (!isNewNewsPresent(lastNewsInDB, newsArticles)) {
        console.log(`No new news in ${country} for ${category}.`);
        return;
      }

      for (const news of newsArticles) {
        if (!lastNewsInDB.some((newsInDB) => newsInDB.title === news.title)) {
          if (news.title.includes('remove')) {
            continue;
          }
          const createdNews = new this.newsModel({
            ...news,
            country,
            category,
          });
          await createdNews.save();

          if (category === NewsCategory.Politics) {
            const isPolitical =
              await this.tweeterService.isTheNewsAboutPolitics(news);
            if (isPolitical?.toLowerCase() === 'yes') {
              console.log('News is about politics.');
              const tweet = await this.tweeterService.createTweet(
                news,
                country,
                category,
              );
              console.log('Tweet created =>', tweet);
              continue;
            }
          } else {
            const tweet = await this.tweeterService.createTweet(
              news,
              country,
              category,
            );
            console.log(`Tweet created for ${country}, ${category}=>`, tweet);
          }
        } else {
          console.log('News already in DB:', news.title);
        }
      }
    } catch (error) {
      console.error('Error in newsScraper:', error);
    }
  }

  async isPolitical(news: NewsDto) {
    return await this.tweeterService.isTheNewsAboutPolitics(news);
  }
}
