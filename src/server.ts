import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes for microfrontends
app.use('/mf_drawer', express.static(path.join(__dirname, 'mf_drawer')));
app.use('/mf_videos', express.static(path.join(__dirname, 'mf_videos')));

// Route for Backend For Frontend (BFF)
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
