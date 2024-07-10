import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { addToFavorites, removeFromFavorites, getFavorites } from './controllers/favoritesControllers';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen (como las de herramientas de desarrollo y cURL)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
