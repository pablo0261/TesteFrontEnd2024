import express from 'express';
const router = express.Router();
import fs from 'fs';

// Endpoint to get favorites
router.get('/favorites', async (req, res) => {
    try {
        const favorites = JSON.parse(await fs.promises.readFile('./favorites.json', 'utf-8'));
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load favorites' });
    }
});

export default router;
