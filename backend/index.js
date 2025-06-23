import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import giphyRoutes from './routes/giphyRoutes.js';
import ratingsRoutes from './routes/ratingsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// This is needed for ES Modules to emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

// API Routes
app.use('/auth', authRoutes);
app.use('/giphy', giphyRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/comments', commentsRoutes);

// Serve frontend build (only for production deployment)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
