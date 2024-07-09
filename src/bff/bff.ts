import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { addToFavorites, removeFromFavorites, getFavorites } from './controllers/favoritesControllers';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3002',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Rutas para manejar favoritos
app.get('/api/favorites', getFavorites); // Obtener todos los favoritos
app.post('/api/favorites/:id', addToFavorites); // Agregar favorito
app.delete('/api/favorites/:id', removeFromFavorites); // Eliminar favorito

// Configurar el puerto de escucha del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
