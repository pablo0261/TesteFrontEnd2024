import { Request, Response } from 'express';
import { toggleFavorite, removeFavorite } from '../utils/videosUtils';

export const handleToggleFavorite = async (req: Request, res: Response): Promise<void> => {
  const videoId: string = req.params.videoId as string;

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' });
    return;
  }

  try {
    const favorites = await toggleFavorite(videoId);
    res.json({ message: 'Video added to favorites', favorites });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

export const handleDeleteFavorite = async (req: Request, res: Response): Promise<void> => {
  const videoId: string = req.params.videoId as string;

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' });
    return;
  }

  try {
    const favorites = await removeFavorite(videoId);
    res.json({ message: 'Video removed from favorites', favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
