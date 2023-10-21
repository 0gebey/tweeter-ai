import axios from 'axios';
import { NewsDto } from '../dtos/news';
import { News } from '../schemas/news';

export const isTimeToTweet = (timeZone: string): boolean => {
  const currentTime = new Date(
    new Date().toLocaleString('en-US', { timeZone }),
  );

  // Get the current hour in the specified time zone
  const currentHour = currentTime.getHours();

  if (
    (currentHour >= 0 && currentHour < 3) ||
    (currentHour >= 7 && currentHour < 24)
  ) {
    return true;
  }

  return false;
};
export const isNewNewsPresent = (
  oldNews: News[],
  newNews: NewsDto[],
): boolean => {
  if (oldNews.length === 0) return true;
  // Check if any item in newNews doesn't have a match in oldNews
  return newNews.some(
    (newsB) => !oldNews.some((newsA) => newsB.title === newsA.title),
  );
};

export const getSourceUrl = async (
  rssFeedUrl: string,
): Promise<string | null> => {
  try {
    const response = await axios.get(rssFeedUrl);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'application/xml');

    // Assuming the source URL is in the 'link' element of the first 'item' element
    const item = xmlDoc.querySelector('item');
    if (item) {
      const linkElement = item.querySelector('link');
      if (linkElement) {
        const sourceUrl = linkElement.textContent;
        return sourceUrl;
      }
    }

    console.log('Failed to extract source URL from the RSS feed.');
    return null;
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return null;
  }
};

export const getImageAsBuffer = async (
  imageUrl: string,
): Promise<Buffer | null> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer', // This ensures that the response data is treated as binary data
    });

    // Convert the binary data to a Buffer
    const imageBuffer = Buffer.from(response.data, 'binary');

    return imageBuffer;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};
