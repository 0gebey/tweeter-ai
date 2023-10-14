export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  news: {
    apiKey: process.env.NEWS_API_KEY,
  },
});
