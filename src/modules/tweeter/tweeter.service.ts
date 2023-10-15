import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { TwitterApi } from 'twitter-api-v2';
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';

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
      /* if (tweet.content.trim().length > 280) {
        this.createTweet(news);
        return;
      } */

      return await this.postTweet(tweet.content.trim());
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }

  async isTheNewsAboutPolitics(news: NewsDto) {
    const openAIApiKey = await this.configService.get('openai.apiKey');
    const prompt =
      'Is the following sentence related to politics? Only say yes if you are sure. Yes, No. Sentence: ${sentence}';
    const promptTemplate = PromptTemplate.fromTemplate(prompt);
    const chatModel = new ChatOpenAI({
      maxTokens: 1,
      openAIApiKey: openAIApiKey,
    });

    const chain = new LLMChain({
      llm: chatModel,
      prompt: promptTemplate,
    });

    const result = await chain.invoke({ sentence: news.title });
    console.log('Examined news: ', news.title);
    console.log('RESULT OF IS POLITICS: ', result);
    return result.text.trim();
  }

  async postTweet(tweetText: string): Promise<any> {
    const twitterClient = new TwitterApi({
      appKey: this.configService.get('twitter.consumerKey'),
      appSecret: this.configService.get('twitter.consumerSecret'),
      accessToken: this.configService.get('twitter.accessTokenKey'), // oauth token from previous step (link generation)
      accessSecret: this.configService.get('twitter.accessTokenSecret'), // oauth token secret from previous step (link generation)
    });
    try {
      if (tweetText.length > 280) throw new Error('Tweet is too long');
      const result = await twitterClient.v2.tweet(tweetText);
      console.log('Tweeted successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Failed to tweet:', error);
    }
  }
}
