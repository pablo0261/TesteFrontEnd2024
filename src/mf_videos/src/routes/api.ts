import { Router } from 'express';
import { searchVideos } from '../controllers/videoController';

const router = Router();

router.get('/search', searchVideos);

export default router;
