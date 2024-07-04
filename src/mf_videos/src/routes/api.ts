import { Router } from 'express';
import { searchVideos } from '../controllers/searchController';
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favoritesController';

const router = Router();

router.get('/search', searchVideos);
router.get('/favorites', getFavorites);
router.post('/favorites/:videoId', addToFavorites);
router.delete('/favorites/:videoId', removeFromFavorites);

export default router;
