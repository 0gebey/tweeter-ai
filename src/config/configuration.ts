export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    promptTemplate: process.env.PROMPT_TEMPLATE,
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
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
});
