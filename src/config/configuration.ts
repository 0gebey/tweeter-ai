export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    promptTemplate: process.env.PROMPT_TEMPLATE,
    sportsPromptTemplate: process.env.SPORTS_PROMPT_TEMPLATE,
  },
  news: {
    apiKey: process.env.NEWS_API_KEY,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    twitterClient: process.env.TWITTER_CLIENT_ID,
    twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,
    sportsConsumerKey: process.env.TWITTER_SPORTS_CONSUMER_KEY,
    sportsConsumerSecret: process.env.TWITTER_SPORTS_CONSUMER_SECRET,
    sportsAccessTokenKey: process.env.TWITTER_SPORTS_ACCESS_TOKEN_KEY,
    sportsAccessTokenSecret: process.env.TWITTER_SPORTS_ACCESS_TOKEN_SECRET,
    sportsBearerToken: process.env.TWITTER_SPORTS_BEARER_TOKEN,
    sportsTwitterClient: process.env.TWITTER_SPORTS_CLIENT_ID,
    sportsTwitterClientSecret: process.env.TWITTER_SPORTS_CLIENT_SECRET,
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
});
