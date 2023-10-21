import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { TwitterApi } from 'twitter-api-v2';
import { LLMChain } from 'langchain/chains';
import { NewsCategory } from '../../enums/newsCategory';
import { NewsCountry } from '../../enums/newsCountry';
import { getImageAsBuffer, getSourceUrl } from '../../util/utils';

@Injectable()
export class TweeterService {
  constructor(private configService: ConfigService) {}

  // Your tweeter logic here
  async createTweet(
    news: NewsDto,
    country: NewsCountry = NewsCountry.Turkey,
    category: NewsCategory = NewsCategory.Politics,
  ) {
    try {
      const openAIApiKey = await this.configService.get('openai.apiKey');
      const template = this.configService.get(
        `twitter.${country}.${category}.promptTemplate`,
      );
      const promptTemplate = PromptTemplate.fromTemplate(template);
      const chatModel = new ChatOpenAI({
        temperature: 0.9,
        openAIApiKey: openAIApiKey,
      });
      const chain = promptTemplate.pipe(chatModel);
      if (news.url.startsWith('https://news.google.com/rss/articles')) {
        news.url = await getSourceUrl(news.url);
      }
      const tweet = await chain.invoke({
        news: news.title,
        description: news.description,
        source: news.author,
        url: news.url,
      });

      console.log(tweet.content);

      return await this.postTweet(
        news,
        tweet.content.trim(),
        country,
        category,
      );
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

  async fetchMediaId(
    news: NewsDto,
    twitterClient: TwitterApi,
  ): Promise<string | undefined> {
    if (news.urlToImage) {
      const image = await getImageAsBuffer(news.urlToImage);
      return twitterClient.v1.uploadMedia(image);
    }
    return undefined;
  }

  async postTweetWithMedia(
    tweetText: string,
    mediaId: string,
    twitterClient: TwitterApi,
  ): Promise<any> {
    return twitterClient.v2.tweet(tweetText, {
      media: {
        media_ids: [mediaId],
      },
    });
  }

  async postTweetWithoutMedia(
    tweetText: string,
    twitterClient: TwitterApi,
  ): Promise<any> {
    return twitterClient.v2.tweet(tweetText);
  }

  async postTweet(
    news: NewsDto,
    tweetText: string,
    country: NewsCountry,
    category: NewsCategory,
  ): Promise<any> {
    const twitterClient = new TwitterApi({
      appKey: this.configService.get(
        `twitter.${country}.${category}.consumerKey`,
      ),
      appSecret: this.configService.get(
        `twitter.${country}.${category}.consumerSecret`,
      ),
      accessToken: this.configService.get(
        `twitter.${country}.${category}.accessTokenKey`,
      ),
      accessSecret: this.configService.get(
        `twitter.${country}.${category}.accessTokenSecret`,
      ),
    });

    try {
      if (tweetText.length > 280) {
        throw new Error('Tweet is too long');
      }

      const mediaId = await this.fetchMediaId(news, twitterClient);

      if (mediaId) {
        const result = await this.postTweetWithMedia(
          tweetText,
          mediaId,
          twitterClient,
        );
        return result.data;
      } else {
        const result = await this.postTweetWithoutMedia(
          tweetText,
          twitterClient,
        );
        return result.data;
      }
    } catch (error) {
      console.error('Tweet Error:', error.message);
    }
  }
}
