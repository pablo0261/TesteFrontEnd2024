import { Request, Response } from 'express';
import { searchVideosInYouTube } from '../services/youtubeServices';
import { toggleFavorite } from '../utils/videosUtils'; 

export const searchVideos = async (req: Request, res: Response): Promise<void> => {
  const query: string = req.query.q as string;

  if (!query) {
    console.log('Query parameter is missing');
    res.status(400).json({ error: 'Query parameter is required' });
    return;
  }

  try {
    console.log(`Searching for videos with query: ${query}`);
    const data = await searchVideosInYouTube(query);
    res.json(data);
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const handleToggleFavorite = async (req: Request, res: Response): Promise<void> => {
  const videoId: string = req.params.videoId as string;

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' });
    return;
  }

  try {
    const favorites = await toggleFavorite(videoId);
    res.json({ message: 'Toggle favorite success', favorites });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};
