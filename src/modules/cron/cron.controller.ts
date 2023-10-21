import { Controller, Get } from '@nestjs/common';
import { CronService } from './cron.service';
import { getSourceUrl } from '../../util/utils';

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
      const result = await getSourceUrl(
        'https://news.google.com/rss/articles/CBMib2h0dHBzOi8vd3d3LnNvemN1LmNvbS50ci9oYXlhdGltL21hZ2F6aW4taGFiZXJsZXJpL3BhcmlzLWhpbHRvbmluLWJlYmVnaW5pbi1uZXcteW9yay1zZXlhaGF0aW5lLWJlZ2VuaS15YWdtdXJ1L9IBc2h0dHBzOi8vd3d3LnNvemN1LmNvbS50ci9oYXlhdGltL21hZ2F6aW4taGFiZXJsZXJpL3BhcmlzLWhpbHRvbmluLWJlYmVnaW5pbi1uZXcteW9yay1zZXlhaGF0aW5lLWJlZ2VuaS15YWdtdXJ1L2FtcC8?oc=5',
      );
      console.log(result);
      return result;
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }
}
