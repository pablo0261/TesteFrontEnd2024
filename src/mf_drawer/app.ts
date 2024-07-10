import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './src/routes/api';

const app = express();

// Configuración de CORS para permitir múltiples orígenes
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
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Fallback to index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'search.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
