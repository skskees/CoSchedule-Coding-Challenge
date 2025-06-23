import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function searchGiphy(req, res) {
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
};
