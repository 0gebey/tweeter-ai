import { NewsDto } from '../dtos/news';
import { News } from '../schemas/news';
import * as url from 'url';
import axios from 'axios';

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

export const getSourceUrl = async (rssFeedUrl: string): Promise<string> => {
  try {
    const parsedURL = url.parse(rssFeedUrl, true);

    // Split the pathname by '/' and find the segment that starts with 'CBMi'
    const encodedSegment = parsedURL.pathname
      .split('/')
      .find((segment) => segment.startsWith('CBMi'));

    if (!encodedSegment) {
      console.error('Could not find encoded URL segment.');
      return null;
    }

    // Extract the Base64 encoded URL from the segment
    const encodedURL = encodedSegment.slice(4); // Removing the 'CBMi' prefix

    // Decode the Base64 URL
    const decodedString = Buffer.from(encodedURL, 'base64').toString('utf-8');

    // Split the decoded string by non-ASCII characters and take the first segment
    let actualURL = decodedString.split(/[^ -~]+/)[0];

    // Remove any leading characters that don't belong to a standard URL
    actualURL = actualURL.replace(/^[^https]+/, '');
    // https://ay.live/api/?api=386c567d1cd756be36107fffe7a9462bd07bbae3&url=yourdestinationlink.com&alias=&format=text&ct=1
    /*     const shortenedURL = await axios.get(
      `https://ay.live/api/?api=386c567d1cd756be36107fffe7a9462bd07bbae3&url=${actualURL}&alias=&format=text&ct=1`,
    );
    console.log('shortenedURL', shortenedURL.data);
    return shortenedURL.data; */
    return actualURL;
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

export const detectImageMimeType = (imageBuffer: Buffer): string => {
  const pngSignature = '89504e47'; // PNG file signature in hexadecimal
  const jpegSignature = 'ffd8'; // JPEG file signature in hexadecimal
  const gifSignature = '47494638'; // GIF file signature in hexadecimal

  const fileSignatureHex = imageBuffer.toString('hex', 0, 4); // Get the first 4 bytes as hexadecimal

  if (fileSignatureHex === pngSignature) {
    return 'image/png';
  } else if (fileSignatureHex.startsWith(jpegSignature)) {
    return 'image/jpeg';
  } else if (fileSignatureHex.startsWith(gifSignature)) {
    return 'image/gif';
  }

  return null; // Unknown or unsupported image format
};
