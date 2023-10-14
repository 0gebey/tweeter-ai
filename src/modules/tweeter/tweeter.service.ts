import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { NewsDto } from '../../dtos/news';
import { PromptTemplate } from 'langchain/prompts';
import { PlanAndExecuteAgentExecutor } from 'langchain/experimental/plan_and_execute';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

@Injectable()
export class TweeterService {
  constructor(private configService: ConfigService) {}

  // Your tweeter logic here
  async createTweet(news: NewsDto) {
    try {
      const openAIApiKey = await this.configService.get('openai.apiKey');
      console.log('NEWS =>>>>> ', news);
      const template = `Sen Türkiye'de yaşayan erkek ve siyasi olarak ılımlı sağ,
    milliyetçi orta yaşlı, üniversite mezunu olan bir gazetecisin.
    Sana temin edilen haberleri kendi profiline uygun olarak yorumlayıp 140 karakteri geçmeyen yeni tweetler üreteceksin.
    haber: {haber}`;

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
}
