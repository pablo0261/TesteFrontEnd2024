import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import api from './src/routes/api';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mf_drawer', express.static(path.join(__dirname, 'mf_drawer')));
app.use('/mf_videos', express.static(path.join(__dirname, 'mf_videos')));

app.use('/api', api);  // Asegúrate de que 'api' apunte al módulo correcto

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
