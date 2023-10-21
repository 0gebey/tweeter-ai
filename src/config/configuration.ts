export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  news: {
    tr: {
      politicsNewsApiKey: process.env.NEWS_API_KEY,
      sportsNewsApiKey: process.env.NEWS_SPORTS_API_KEY,
      entertainmentNewsApiKey: process.env.NEWS_ENTERTAINMENT_API_KEY,
    },
    usa: {
      politicsNewsApiKey: process.env.NEWS_USA_API_KEY,
      sportsNewsApiKey: process.env.NEWS_SPORTS_USA_API_KEY,
      entertainmentNewsApiKey: process.env.NEWS_ENTERTAINMENT_USA_API_KEY,
    },
  },
  twitter: {
    tr: {
      politics: {
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
        accessTokenSecret:
          process.env.TWITTER_ENTERTAINMENT_ACCESS_TOKEN_SECRET,
        bearerToken: process.env.TWITTER_ENTERTAINMENT_BEARER_TOKEN,
        clientId: process.env.TWITTER_ENTERTAINMENT_CLIENT_ID,
        clientSecret: process.env.TWITTER_ENTERTAINMENT_CLIENT_SECRET,
      },
    },
    usa: {
      politics: {
        promptTemplate: process.env.PROMPT_USA_TEMPLATE,
        consumerKey: process.env.TWITTER_USA_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_USA_CONSUMER_SECRET,
        accessTokenKey: process.env.TWITTER_USA_ACCESS_TOKEN_KEY,
        accessTokenSecret: process.env.TWITTER_USA_ACCESS_TOKEN_SECRET,
        bearerToken: process.env.TWITTER_USA_BEARER_TOKEN,
        clientId: process.env.TWITTER_USA_CLIENT_ID,
        clientSecret: process.env.TWITTER_USA_CLIENT_SECRET,
      },
      sports: {
        promptTemplate: process.env.SPORTS_USA_PROMPT_TEMPLATE,
        consumerKey: process.env.TWITTER_SPORTS_USA_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_SPORTS_USA_CONSUMER_SECRET,
        accessTokenKey: process.env.TWITTER_SPORTS_USA_ACCESS_TOKEN_KEY,
        accessTokenSecret: process.env.TWITTER_SPORTS_USA_ACCESS_TOKEN_SECRET,
        bearerToken: process.env.TWITTER_SPORTS_USA_BEARER_TOKEN,
        clientId: process.env.TWITTER_SPORTS_USA_CLIENT_ID,
        clientSecret: process.env.TWITTER_SPORTS_USA_CLIENT_SECRET,
      },
      entertainment: {
        promptTemplate: process.env.ENTERTAINMENT_USA_PROMPT_TEMPLATE,
        consumerKey: process.env.TWITTER_ENTERTAINMENT_USA_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_ENTERTAINMENT_USA_CONSUMER_SECRET,
        accessTokenKey: process.env.TWITTER_ENTERTAINMENT_USA_ACCESS_TOKEN_KEY,
        accessTokenSecret:
          process.env.TWITTER_ENTERTAINMENT_USA_ACCESS_TOKEN_SECRET,
        bearerToken: process.env.TWITTER_ENTERTAINMENT_USA_BEARER_TOKEN,
        clientId: process.env.TWITTER_ENTERTAINMENT_USA_CLIENT_ID,
        clientSecret: process.env.TWITTER_ENTERTAINMENT_USA_CLIENT_SECRET,
      },
    },
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
});
