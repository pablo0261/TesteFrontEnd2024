import express from 'express';
import apiRoutes from './api';

const app = express();
const PORT = process.env.PORT2 || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

