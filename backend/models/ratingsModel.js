import db from './db.js';

export async function addOrUpdateRating(user_id, giphy_id, rating) {
    try {
      const result = await db.run(
    `INSERT INTO ratings (user_id, giphy_id, rating) VALUES (?, ?, ?)
     ON CONFLICT(user_id, giphy_id) DO UPDATE SET rating = excluded.rating`,
    [user_id, giphy_id, rating]
  );
      console.log('Rating updated/created');
      return result;
    } catch (err) {
      console.error('Error creating/updating rating: ', err);
      throw err;
    }
};

export async function getGifRatings(giphy_id) {
    try {
        const result = await db.all(`SELECT * FROM ratings WHERE giphy_id = ?`, [giphy_id]);
        console.log('Got ratings for ', giphy_id)
        return result;
    } catch (err){
        console.error("Error getting gif ratings: ", err);
        throw err;
    }
};