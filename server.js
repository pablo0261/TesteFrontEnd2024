require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});