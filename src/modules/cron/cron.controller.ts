import { Controller, Get } from '@nestjs/common';
import { CronService } from './cron.service';
import { getSourceUrl } from '../../util/utils';
import { NewsCategory } from '../../enums/newsCategory';
import { NewsCountry } from '../../enums/newsCountry';
import { NewsTimeZone } from '../../enums/newsTimeZone';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get()
  async runCron() {
    try {
      const result = await this.cronService.runCron();
      return result;
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }

  @Get('/test')
  async testParser() {
    try {
      /*       for (const country of Object.keys(NewsCountry)) {
        for (const category of Object.keys(NewsCategory)) {
          try {
            console.log(
              NewsCountry[country],
              NewsTimeZone[country],
              NewsCategory[category],
              'politics' === NewsCategory[category],
            );
          } catch (error) {
            console.error('error on newsScrpper', error);
          }
        }
      } */
      const result = await getSourceUrl(
        'https://news.google.com/rss/articles/CBMib2h0dHBzOi8vd3d3LnNvemN1LmNvbS50ci9oYXlhdGltL21hZ2F6aW4taGFiZXJsZXJpL3BhcmlzLWhpbHRvbmluLWJlYmVnaW5pbi1uZXcteW9yay1zZXlhaGF0aW5lLWJlZ2VuaS15YWdtdXJ1L9IBc2h0dHBzOi8vd3d3LnNvemN1LmNvbS50ci9oYXlhdGltL21hZ2F6aW4taGFiZXJsZXJpL3BhcmlzLWhpbHRvbmluLWJlYmVnaW5pbi1uZXcteW9yay1zZXlhaGF0aW5lLWJlZ2VuaS15YWdtdXJ1L2FtcC8?oc=5',
      );
      console.log(result);
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }
}
