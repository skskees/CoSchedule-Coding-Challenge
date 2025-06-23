import * as commentsModel from '../models/commentsModel.js';
export async function addComment(req, res) {
    const user_id = req.user.id;
    const {giphy_id, comment} = req.body;

    try {
        await commentsModel.addComment(user_id, giphy_id, comment)
        res.status(201).json({message: 'Comment added to ', giphy_id});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'DB error'});
    }
};
export async function getCommentsForGif(req, res) {
    const {giphy_id} = req.params;
    try {
        const results = await commentsModel.getCommentsForGif(giphy_id);
        res.json(results)
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'DB error'});
    }
};

export async function updateComment(req, res) {
    const user_id = req.user.id;
    const {comment_id, comment} = req.body;

    try {
        const result = await commentsModel.updateComment(comment_id, user_id, comment);
        if (result.changes === 0){
            return res.status(403).json({ error: 'Not authorized or comment not found' });
        }
        res.status(201).json({message: 'Comment updated'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'DB error'});
    }
};

export async function deleteComment(req, res) {
    const user_id = req.user.id;
    const {comment_id} = req.body;

    try {
        const result = await commentsModel.deleteComment(comment_id, user_id);
        if (result.changes === 0){
            return res.status(403).json({ error: 'Not authorized or comment not found' });
        }
        res.status(201).json({message: 'Comment deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'DB error'});
    }
};