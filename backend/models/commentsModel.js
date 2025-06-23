import db from './db.js';


export async function addComment(user_id, giphy_id, comment) {
    try {
        const result = await db.run(
            `INSERT INTO comments (user_id, giphy_id, comment) VALUES (?, ?, ?)`,
            [user_id, giphy_id, comment]
        );
        console.log('Comment created');
        return result;
    } catch (err) {
        console.error('Error creating comment: ', err);
        throw err;
    }
};

export async function getCommentsForGif (giphy_id) {
    try {
        const result = await db.all(
            `SELECT comments.id, comments.comment, comments.created_at, users.username
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.giphy_id = ?
            ORDER BY comments.created_at DESC`,
            [giphy_id]
        );
        console.log('Got comments for ', giphy_id)
        return result;
    } catch (err) {
        console.error('Error getting comments: ', err);
        throw err;
    }
};

export async function updateComment(comment_id, user_id, newComment) {
    try {
        const result = await db.run(
            `UPDATE comments SET comment = ? WHERE id = ? AND user_id = ?`,
            [newComment, comment_id, user_id]
        );
    } catch(err) {
        console.error('Error updating comment: ', err);
        throw err;  
    }
};
export async function deleteComment (comment_id, user_id) {
    try {
        const result = await db.run(
            `DELETE FROM comments WHERE id = ? AND user_id = ?`,
            [comment_id, user_id]
        );
    } catch(err) {
        console.error('Error deleting comment: ', err);
        throw err; 
    }
};