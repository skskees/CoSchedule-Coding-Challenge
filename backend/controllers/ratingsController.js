import * as ratingsModel from '../models/ratingsModel.js';

export async function addOrUpdateRating(req, res) {
  const user_id = req.user.id;
  const { giphy_id, rating } = req.body;

  try {
    await ratingsModel.addOrUpdateRating(user_id, giphy_id, rating);
    res.status(201).json({ message: 'Rating saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}

export async function getGifRatings(req, res) {
  const { giphy_id } = req.params;

  try {
    const result = await ratingsModel.getGifRatings(giphy_id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
}
