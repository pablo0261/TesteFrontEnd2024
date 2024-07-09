"use strict";

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

export const searchVideos = async (query: string): Promise<any[]> => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: API_KEY,
                q: query,
                part: 'snippet',
                type: 'video',
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error al buscar vídeos en YouTube:', error);
        return [];
    }
};
