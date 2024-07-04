import { Request, Response } from 'express';

interface Video {
    id: string;
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
        const { videoId } = req.params;
        const existingIndex = favorites.findIndex(fav => fav.id === videoId);
        if (existingIndex !== -1) {
            res.status(400).json({ error: 'Video already exists in favorites.' });
            return;
        }

        const newFavorite: Video = { id: videoId };
        favorites.push(newFavorite);

        res.status(200).json({ message: 'added' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Error adding to favorites.' });
    }
};

export const removeFromFavorites = (req: Request, res: Response): void => {
    try {
        const { videoId } = req.params;
        const index = favorites.findIndex(fav => fav.id === videoId);
        if (index !== -1) {
            favorites.splice(index, 1);
            res.status(200).json({ message: 'removed' });
        } else {
            res.status(404).json({ error: 'Video not found in favorites.' });
        }
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Error removing from favorites.' });
    }
};
