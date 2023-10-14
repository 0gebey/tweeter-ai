import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}
  @Get()
  async newsScraper() {
    this.scraperService.newsScraper();
    // Your scraper logic here
  }
}
