import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { TwitterApi } from 'twitter-api-v2';
import { LLMChain } from 'langchain/chains';
import { NewsType } from '../../enums/newsType';

@Injectable()
export class TweeterService {
  constructor(private configService: ConfigService) {}

  // Your tweeter logic here
  async createTweet(news: NewsDto, newsType: NewsType = NewsType.News) {
    try {
      const openAIApiKey = await this.configService.get('openai.apiKey');
      const template = this.configService.get(
        `twitter.${newsType}.promptTemplate`,
      );
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

      return await this.postTweet(tweet.content.trim(), newsType);
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

  async postTweet(tweetText: string, newsType: NewsType): Promise<any> {
    const twitterClient = new TwitterApi({
      appKey: this.configService.get(`twitter.${newsType}.consumerKey`),
      appSecret: this.configService.get(`twitter.${newsType}.consumerSecret`),
      accessToken: this.configService.get(`twitter.${newsType}.accessTokenKey`),
      accessSecret: this.configService.get(
        `twitter.${newsType}.accessTokenSecret`,
      ),
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
