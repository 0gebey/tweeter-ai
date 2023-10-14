import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { TweeterService } from '../tweeter/tweeter.service';

@Injectable()
export class ScraperService {
  constructor(
    private configService: ConfigService,
    private readonly tweeterService: TweeterService,
  ) {}

  @Cron('*/15 * * * *')
  async newsScraper() {
    try {
      /*       const sources = await axios.get(
        'https://newsapi.org/v2/sources?country=tr&apiKey=' +
          this.configService.get('news.apiKey'),
      );
      console.log(sources.data); */
      const newsInTR = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=tr&category=politics&apiKey=' +
          this.configService.get('news.apiKey'),
      );
      console.log(newsInTR.data);
      /*       const tweet = await this.tweeterService.createTweet(
        newsInTR.data.articles[0],
      );
      console.log(tweet); */
    } catch (error) {
      console.error('ERROR WHILE RETRIEVING THE NEWS', error);
    }
    // Your scraper logic here
  }
}
