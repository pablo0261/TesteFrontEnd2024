"use strict";

import express, { Request, Response } from 'express';
import { searchVideos } from '../services/youtubeServices';

const router = express.Router();
export { router };

router.get('/', async (req: Request, res: Response): Promise<Response> => {
    const query = req.query.q as string;
    if (!query) {
        return res.status(400).json({ error: 'Parámetro "q" no especificado.' });
    }
    try {
        const videos = await searchVideos(query);
        return res.json(videos);
    } catch (error) {
        console.error('Error en la búsqueda de vídeos:', error);
        return res.status(500).json({ error: 'Error en la búsqueda de vídeos.' });
    }
});
