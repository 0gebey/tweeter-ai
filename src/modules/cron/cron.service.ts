import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScraperService } from '../scraper/scraper.service';
import { NewsCategory } from '../../enums/newsCategory';
import { NewsCountry } from '../../enums/newsCountry';
import { NewsTimeZone } from '../../enums/newsTimeZone';

@Injectable()
export class CronService {
  constructor(private readonly scrapperService: ScraperService) {}
  // Run cron in every 30 minutes
  // 0 */30 * * * *
  @Cron('0 */30 * * * *')
  async runCron() {
    try {
      for (const country of Object.keys(NewsCountry)) {
        for (const category of Object.keys(NewsCategory)) {
          try {
            await this.scrapperService.newsScraper(
              NewsCountry[country],
              NewsTimeZone[country],
              NewsCategory[category],
            );
          } catch (error) {
            console.error('error on newsScrpper', error);
          }
        }
      }
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }
}
