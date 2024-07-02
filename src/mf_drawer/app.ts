import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT1 || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'search.html'));
});

app.get('/favorites', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'favorites.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`mf_drawer is running on http://localhost:${PORT}`);
});
