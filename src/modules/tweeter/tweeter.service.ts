import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { PlanAndExecuteAgentExecutor } from 'langchain/experimental/plan_and_execute';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import axios from 'axios';
import qs from 'qs';

@Injectable()
export class TweeterService {
  constructor(private configService: ConfigService) {}

  // Your tweeter logic here
  async createTweet(news: NewsDto) {
    try {
      const openAIApiKey = await this.configService.get('openai.apiKey');
      console.log('NEWS =>>>>> ', news);
      const template = this.configService.get('openai.promptTemplate');

      const promptTemplate = PromptTemplate.fromTemplate(template);

      const chatModel = new ChatOpenAI({
        temperature: 0.9,
        openAIApiKey: openAIApiKey,
      });

      /*       const tools = [new Calculator(), new SerpAPI()];

      const executor = await initializeAgentExecutorWithOptions(
        tools,
        chatModel,
        {
          agentType: 'openai-functions',
          verbose: true,
        },
      );

      const result = await executor.run(news.title);
      console.log('RESULT =>>>>> ', result); */
      const chain = promptTemplate.pipe(chatModel);
      console.log('NEWS =>>>>> ', news);
      const tweet = await chain.invoke({
        haber: news.title,
      });
      console.log(tweet.content);
    } catch (error) {
      console.error('ERROR WHILE CREATING THE TWEET', error);
    }
  }

  async postTweet(tweetText: string): Promise<void> {
    // Endpoint URL for Tweet creation
    const endpointUrl = 'https://api.twitter.com/1.1/statuses/update.json';

    // OAuth 1.0 Authentication details
    const oauthData = {
      consumer_key: 'YOUR_CONSUMER_KEY',
      consumer_secret: 'YOUR_CONSUMER_SECRET',
      token: 'YOUR_ACCESS_TOKEN',
      token_secret: 'YOUR_ACCESS_TOKEN_SECRET',
      // other oauth parameters like nonce, timestamp etc., should be generated per request
    };

    // OAuth 1.0 can be a bit tricky, so consider using a library like 'oauth-1.0a' to generate headers

    // Generate OAuth headers
    const oauthHeaders = ''; // Replace with headers generated using OAuth library

    try {
      const response = await axios.post(
        endpointUrl,
        qs.stringify({ status: tweetText }),
        {
          headers: {
            Authorization: oauthHeaders,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('Tweeted successfully:', response.data);
    } catch (error) {
      console.error('Failed to tweet:', error);
    }
  }
}
