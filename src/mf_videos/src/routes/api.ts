// src/routes/api.ts
import { Router } from 'express';
import { searchVideos } from '../controllers/searchController';
import { handleToggleFavorite, handleDeleteFavorite } from '../controllers/favoritesController';

const router = Router();

router.get('/search', searchVideos);
router.post('/favorites/:videoId', handleToggleFavorite);
router.delete('/favorites/:videoId', handleDeleteFavorite);

export default router;
