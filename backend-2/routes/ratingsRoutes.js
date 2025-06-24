import {DB} from '../connect.js';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());


//GET Get all ratings
app.get('/', (req ,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM ratings';
    let data = {ratings: []};
    try {
        DB.all(sql, [], (err, rows) => {
            if(err){
                throw err; //catch will handle it
            }
            rows.forEach(row => {
                data.ratings.push({id: row.id, user_id: row.user_id, giphy_id: row.giphy_id, rating: row.rating, created_at: row.created_at});
            });
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (err){
        console.log('GET ALL RATINGS: ',err.message);
        res.status(400).send('GET ALL RATINGS: ',err.message);
    }
});

// GET - Get a single rating
app.get('/getRating/:ratingId', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM ratings WHERE id = ?';
    const ratingId = req.params.ratingId;

    try {
        DB.get(sql, [ratingId], (err, row) => {
            if (err) {
                console.log('GET ONE RATING ERROR: ', err.message);
                return res.status(500).send('Error retrieving rating');
            }
            if (!row) {
                return res.status(404).send('Rating not found');
            }

            const data = {
                id: row.id,
                user_id: row.user_id,
                giphy_id: row.giphy_id,
                rating: row.rating,
                created_at: row.created_at
            };

            res.json(data);
        });
    } catch (err) {
        console.log('GET ONE RATING: ', err.message);
        res.status(500).send('Internal server error');
    }
});

//POST rating
app.post('/', (req,res) => {
    console.log(req.body);
    res.set('content-type', 'application/json');
    const sql = `INSERT INTO ratings (user_id, giphy_id, rating, created_at) VALUES (?, ?, ?, ?)`;
    let newId;
    try {
        DB.run(sql, [req.body.user_id, req.body.giphy_id, req.body.rating, new Date().toJSON()], function(err){
            if(err) throw err;
            newId = this.lastID; //provides the autoincremented integer for rating_id!
            res.status(201);
            let data = {status: 201, message: `Rating saved!`}
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
});


//DELETE rating
app.delete('/', (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM ratings WHERE id=?';
    try {
        DB.run(sql, [req.query.id], function(err){
            if(err) throw err;
            if(this.changes ===  1) {
                //1 item deleted (good)
                res.status(200).send("Rating was deleted!");
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