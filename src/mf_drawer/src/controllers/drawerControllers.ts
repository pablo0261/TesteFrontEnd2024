"use strict";
import { Request, Response } from 'express';

export const getFavorites = (req: Request, res: Response): void => {
    try {
        // Obtener favoritos desde localStorage
        const favorites: { videoId: string }[] = JSON.parse(localStorage.getItem('favorites') || '[]');
        res.json(favorites);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ error: 'Error al obtener favoritos.' });
    }
};

export const addToFavorites = (req: Request, res: Response): void => {
    try {
        const { videoId } = req.body;
        // Obtener favoritos desde localStorage
        let favorites: { videoId: string }[] = JSON.parse(localStorage.getItem('favorites') || '[]');
        // Verificar si el video ya está en favoritos
        const existingIndex = favorites.findIndex((fav) => fav.videoId === videoId);
        if (existingIndex !== -1) {
            // Eliminar de favoritos si ya existe
            favorites = favorites.filter((_, index) => index !== existingIndex);
        } else {
            // Agregar a favoritos si no existe
            favorites.push({ videoId });
        }
        // Guardar en localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        res.json({ success: true });
    } catch (error) {
        console.error('Error al añadir a favoritos:', error);
        res.status(500).json({ error: 'Error al añadir a favoritos.' });
    }
};
