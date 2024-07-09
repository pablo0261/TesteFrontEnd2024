// favoritesController.ts

import { Request, Response } from 'express';

interface Video {
  id: string;
  title?: string; // Título es opcional
  thumbnail?: string; // Thumbnail es opcional
}

let favorites: Video[] = [];

export const getFavorites = (req: Request, res: Response): void => {
  try {
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites.' });
  }
};

export const addToFavorites = (req: Request, res: Response): void => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL

    // Check if video already exists in favorites
    const existingIndex = favorites.findIndex(fav => fav.id === id);
    if (existingIndex !== -1) {
      favorites.splice(existingIndex, 1); // Remove existing favorite
      res.json({ message: 'Video removed from favorites.' });
    } else {
      // Add new favorite with default or empty title and thumbnail
      const newFavorite: Video = { id, title: '', thumbnail: '' };
      favorites.push(newFavorite);
      res.json({ message: 'Video added to favorites.' });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Error adding to favorites.' });
  }
};

export const removeFromFavorites = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    // Find index of the video in favorites array
    const index = favorites.findIndex(fav => fav.id === id);
    if (index !== -1) {
      favorites.splice(index, 1); // Remove from favorites
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Video not found in favorites.' });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Error removing from favorites.' });
  }
};
