import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TweeterService {
  constructor(private configService: ConfigService) {}

  // Your tweeter logic here
  async createTweet(news: NewsDto) {
    try {
      const openAIApiKey = await this.configService.get('openai.apiKey');
      const template = this.configService.get('openai.promptTemplate');
      const promptTemplate = PromptTemplate.fromTemplate(template);
      const chatModel = new ChatOpenAI({
        temperature: 0.9,
        openAIApiKey: openAIApiKey,
      });
      const chain = promptTemplate.pipe(chatModel);
      const tweet = await chain.invoke({
        haber: news.title,
        kaynak: news.author,
      });

      console.log(tweet.content);

      return await this.postTweet(tweet.content.trim().slice(1, -1));
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }

  async postTweet(tweetText: string): Promise<any> {
    const twitterClient = new TwitterApi({
      appKey: this.configService.get('twitter.consumerKey'),
      appSecret: this.configService.get('twitter.consumerSecret'),
      accessToken: this.configService.get('twitter.accessTokenKey'), // oauth token from previous step (link generation)
      accessSecret: this.configService.get('twitter.accessTokenSecret'), // oauth token secret from previous step (link generation)
    });
    try {
      const result = await twitterClient.v2.tweet(tweetText);
      console.log('Tweeted successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Failed to tweet:', error);
    }
  }
}
