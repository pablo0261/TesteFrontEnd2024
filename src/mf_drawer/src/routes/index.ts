"use strict";

import express from 'express';
import { getFavorites, addToFavorites } from '../controllers/drawerControllers';

const router = express.Router();
export { router };

// Rutas
router.get('/favorites', getFavorites);
router.post('/favorites', addToFavorites);
