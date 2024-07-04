import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const searchVideosInYouTube = async (query: string) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 12, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos from YouTube:', error);
    throw new Error('Failed to fetch videos');
  }
};
