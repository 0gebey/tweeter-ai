import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { NewsDto } from '../../dtos/news';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  async newsScraper() {
    this.scraperService.newsScraper();
    // Your scraper logic here
  }

  @Get('test')
  async test() {
    try {
      const twitterClient = new TwitterApi({
        appKey: this.configService.get('twitter.consumerKey'),
        appSecret: this.configService.get('twitter.consumerSecret'),
        accessToken: this.configService.get('twitter.accessTokenKey'), // oauth token from previous step (link generation)
        accessSecret: this.configService.get('twitter.accessTokenSecret'), // oauth token secret from previous step (link generation)
      });
      const response = await twitterClient.v2.tweet('Hello World!');
      console.log(response);
      const ibo = await twitterClient.v2.userByUsername('haskaloglu');
      console.log(ibo);
      return ibo;
    } catch (error) {
      console.error('Failed to tweet:', error);
    }
  }

  @Get('isPolitics')
  async isPolitics() {
    try {
      const news = {
        title: 'Fenerbahçe Galatasaray derbisi yarın saat 19:00da oynanacak',
      } as NewsDto;
      const result = await this.scraperService.isPolitical(news);
      return result;
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }
}
