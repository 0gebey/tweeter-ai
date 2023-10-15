import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ConfigService } from '@nestjs/config';
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
  }

  @Get('sports')
  async sportsNewsScraper() {
    this.scraperService.sportsNewsScraper();
  }

  @Get('entertainment')
  async entertainmentNewsScraper() {
    this.scraperService.entertainmentNewsScraper();
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
