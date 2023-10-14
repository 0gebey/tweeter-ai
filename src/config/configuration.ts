export default async () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    promptTemplate: process.env.PROMPT_TEMPLATE,
  },
  news: {
    apiKey: process.env.NEWS_API_KEY,
  },
});
