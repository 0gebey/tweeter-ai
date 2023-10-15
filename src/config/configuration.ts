export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  news: {
    apiKey: process.env.NEWS_API_KEY,
  },
  twitter: {
    news: {
      promptTemplate: process.env.PROMPT_TEMPLATE,
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    },
    sports: {
      promptTemplate: process.env.SPORTS_PROMPT_TEMPLATE,
      consumerKey: process.env.TWITTER_SPORTS_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_SPORTS_CONSUMER_SECRET,
      accessTokenKey: process.env.TWITTER_SPORTS_ACCESS_TOKEN_KEY,
      accessTokenSecret: process.env.TWITTER_SPORTS_ACCESS_TOKEN_SECRET,
      bearerToken: process.env.TWITTER_SPORTS_BEARER_TOKEN,
      clientId: process.env.TWITTER_SPORTS_CLIENT_ID,
      clientSecret: process.env.TWITTER_SPORTS_CLIENT_SECRET,
    },
    entertainment: {
      promptTemplate: process.env.ENTERTAINMENT_PROMPT_TEMPLATE,
      consumerKey: process.env.TWITTER_ENTERTAINMENT_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_ENTERTAINMENT_CONSUMER_SECRET,
      accessTokenKey: process.env.TWITTER_ENTERTAINMENT_ACCESS_TOKEN_KEY,
      accessTokenSecret: process.env.TWITTER_ENTERTAINMENT_ACCESS_TOKEN_SECRET,
      bearerToken: process.env.TWITTER_ENTERTAINMENT_BEARER_TOKEN,
      clientId: process.env.TWITTER_ENTERTAINMENT_CLIENT_ID,
      clientSecret: process.env.TWITTER_ENTERTAINMENT_CLIENT_SECRET,
    },
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
});
