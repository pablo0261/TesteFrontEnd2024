require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const FAVORITES_FILE = path.join(__dirname, 'favorites.json');

// Helper function to read favorites
const readFavorites = () => {
    if (fs.existsSync(FAVORITES_FILE)) {
        const data = fs.readFileSync(FAVORITES_FILE);
        return JSON.parse(data);
    }
    return [];
};

// Helper function to write favorites
const writeFavorites = (favorites) => {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
};

// Endpoint to search videos
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: YOUTUBE_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

// Endpoint to get favorites
app.get('/favorites', (req, res) => {
    const favorites = readFavorites();
    res.json(favorites);
});

// Endpoint to add/remove a favorite
app.post('/favorites', (req, res) => {
    const video = req.body.video;
    if (!video || !video.id || !video.id.videoId) {
        return res.status(400).json({ error: 'Invalid video data' });
    }

    let favorites = readFavorites();
    const index = favorites.findIndex(fav => fav.id.videoId === video.id.videoId);

    if (index === -1) {
        favorites.push(video);
    } else {
        favorites.splice(index, 1);
    }

    writeFavorites(favorites);
    res.json(favorites);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
