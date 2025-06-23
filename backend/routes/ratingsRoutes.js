import express from 'express';
import { addOrUpdateRating, getGifRatings } from '../controllers/ratingsController.js';

const router = express.Router();

router.post('/add', addOrUpdateRating);
router.post('/get', getGifRatings);

export default router;
