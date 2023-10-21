import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './modules/scraper/scraper.module';
import { TweeterModule } from './modules/tweeter/tweeter.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongo = await configService.get('mongo');
        return {
          uri: mongo.uri,
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ScraperModule,
    TweeterModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
