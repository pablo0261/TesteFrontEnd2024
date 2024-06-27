import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const favoritesFile = path.join(__dirname, '../../favorites.json');

router.get('/favorites', (req: Request, res: Response) => {
  fs.readFile(favoritesFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read favorites' });
    }
    const favorites = JSON.parse(data.toString());
    res.json(favorites);
  });
});

router.post('/favorites', (req: Request, res: Response) => {
  const video = req.body.video;
  if (!video || !video.id || !video.id.videoId) {
    return res.status(400).json({ error: 'Invalid video data' });
  }

  fs.readFile(favoritesFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read favorites' });
    }
    let favorites = JSON.parse(data.toString());
    const videoIndex = favorites.findIndex((fav: any) => fav.id.videoId === video.id.videoId);

    if (videoIndex !== -1) {
      favorites.splice(videoIndex, 1);
    } else {
      favorites.push(video);
    }

    fs.writeFile(favoritesFile, JSON.stringify(favorites), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save favorites' });
      }
      res.json({ message: 'Favorite updated successfully' });
    });
  });
});

export default router;
