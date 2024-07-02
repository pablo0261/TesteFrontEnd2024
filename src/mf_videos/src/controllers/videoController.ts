import { Request, Response } from 'express';
import axios from 'axios';

export const searchVideos = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    console.log('Query parameter is missing');
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    console.log(`Searching for videos with query: ${query}`);
    
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.YOUTUBE_API_KEY || "your-api-key",
      },
    });

    console.log(`YouTube API response: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching videos from YouTube API:', error.message);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
        res.status(500).json({
          error: 'Failed to fetch videos',
          details: error.response?.data,
        });
      } else {
        res.status(500).json({ error: 'Failed to fetch videos', details: error.message });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch videos', details: 'Unknown error' });
    }
  }
};
