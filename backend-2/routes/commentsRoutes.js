import {DB} from '../connect.js';
import express from 'express';
import bodyParser from 'body-parser';
import authenticateToken from '../middleware/authMiddleware.js'
const app = express();
app.use(bodyParser.json());


//GET Get all comments
app.get('/', authenticateToken, (req ,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM comments';
    let data = {comments: []};
    try {
        DB.all(sql, [], (err, rows) => {
            if(err){
                throw err; //catch will handle it
            }
            rows.forEach(row => {
                data.comments.push({id: row.id, user_id: row.user_id, giphy_id: row.giphy_id, comment: row.comment, created_at: row.created_at});
            });
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (err){
        console.log('GET ALL COMMENTS: ',err.message);
        res.status(400).send('GET ALL COMMENTS: ',err.message);
    }
});

// GET - Get a single comment
app.get('/getComment/:commentId', authenticateToken, (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM comments WHERE id = ?';
    const commentId = req.params.commentId;

    try {
        DB.get(sql, [commentId], (err, row) => {
            if (err) {
                console.log('GET ONE COMMENT ERROR: ', err.message);
                return res.status(500).send('Error retrieving comment');
            }
            if (!row) {
                return res.status(404).send('Comment not found');
            }

            const data = {
                id: row.id,
                user_id: row.user_id,
                giphy_id: row.giphy_id,
                comment: row.comment,
                created_at: row.created_at
            };

            res.json(data);
        });
    } catch (err) {
        console.log('GET ONE COMMENT: ', err.message);
        res.status(500).send('Internal server error');
    }
});

//POST comment
app.post('/', authenticateToken, (req,res) => {
    console.log(req.body);
    res.set('content-type', 'application/json');
    const sql = `INSERT INTO comments (user_id, giphy_id, comment, created_at) VALUES (?, ?, ?, ?)`;
    let newId;
    try {
        DB.run(sql, [req.body.user_id, req.body.giphy_id, req.body.comment, new Date().toJSON()], function(err){
            if(err) throw err;
            newId = this.lastID; //provides the autoincremented integer for comment id!
            res.status(201);
            let data = {status: 201, message: `Comment saved!`}
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
});


//DELETE comment
app.delete('/', authenticateToken, (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM comments WHERE id=?';
    try {
        DB.run(sql, [req.query.id], function(err){
            if(err) throw err;
            if(this.changes ===  1) {
                //1 item deleted (good)
                res.status(200).send("Comment was deleted!");
            } else {
                //no delete done 
                res.status(200).send("No operation needed.");
            }
        })
    } catch (err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

export default app;