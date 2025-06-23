import express from 'express';
import { addComment, getCommentsForGif, updateComment, deleteComment } from '../controllers/commentsController.js';

const router = express.Router();

router.post('/add', addComment);
router.post('/get', getCommentsForGif);
router.put('/update', updateComment);
router.delete('/delete', deleteComment);

export default router;
