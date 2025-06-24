import express from 'express';
import axios from 'axios';
import { DB } from '../connect.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());  // <-- use built-in body parser

app.get('/search', async (req, res) => {
  const { q, limit = 25, offset = 0 } = req.query;
  try {
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q,
        limit,
        offset
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giphy API failed' });
  }
});

export default app;
