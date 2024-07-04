// src/services/youtubeServices.ts
import axios from 'axios';

export const searchVideosInYouTube = async (query: string): Promise<any> => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}`;

    const response = await axios.get(url);
    return response.data;
};
