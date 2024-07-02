// src/routes/api.ts

import { Router } from 'express';
import { searchVideos, handleToggleFavorite } from '../controllers/videoController';

const router = Router();

router.get('/search', searchVideos);
router.post('/favorites/:videoId', handleToggleFavorite); 

export default router;
