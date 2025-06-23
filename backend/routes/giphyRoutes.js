import express from 'express';
import { searchGiphy } from '../controllers/giphyController.js';

const router = express.Router();

router.get('/search', searchGiphy);

export default router;
