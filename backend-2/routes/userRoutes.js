import {DB} from '../connect.js';
import express from 'express';
import bodyParser from 'body-parser';
import UserService from '../helpers/UserService.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(bodyParser.json());
const userService = new UserService(DB);

//POST user (creating/registering user)
app.post('/register', async (req,res) => {
    console.log(req.body);
    res.set('content-type', 'application/json');
    const sql = `INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)`;
    let newId;
    try {

        if(!req.body.username || typeof req.body.username !== 'string') {
            throw new Error('Invalid username!')
        }

        if(!UserService.isValidEmail(req.body.email)){
            throw new Error('Invalid email format!')
        }

        if(!req.body.password || typeof req.body.password !== 'string'){
            throw new Error('Password is required!')
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        userService.isUsernameTaken(req.body.username, (err, taken) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        if (taken) {
            return res.status(400).send('Username already taken!');
        }
        
        
        DB.run(sql, [req.body.username, req.body.email, hash, new Date().toJSON()], function(err){
            if(err) throw err;
            newId = this.lastID; //provides the autoincremented integer for comment id!
            res.status(201);
            let data = {status: 201, message: `User registered!`}
            let content = JSON.stringify(data);
            res.send(content);
        })
        });
    } catch (err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
    
});



//POST user (login)
app.post('/login', (req, res) => {
  console.log('Login request body:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  DB.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    try {
      const match = await bcrypt.compare(password, user.password_hash);
      
      if (!match) {
        console.log('Password mismatch');
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { user_id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        userId: user.id,
        username: user.username,
    });

    } catch (err) {
      console.error('Bcrypt error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});


//GET - specific user by username
app.get('/getUser/:username', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM users WHERE username=?';
    const username = req.params.username;
    try {
        DB.get(sql, [username], (err, row) => {
            if (err) {
                console.log('GET ONE USER ERROR: ', err.message);
                return res.status(500).send('Error retrieving user');
            }
            if (!row) {
                return res.status(404).send('User not found');
            }

            const data = {
                id: row.id,
                username: row.username,
                email: row.email,
                password_hash: row.password_hash,
                created_at: row.created_at
            };

            res.json(data);
        });
    } catch (err) {
        console.log('GET ONE USER: ', err.message);
        res.status(500).send('Internal server error');
    }
});

//GET Get all users
app.get('/', (req ,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM users';
    let data = {users: []};
    try {
        DB.all(sql, [], (err, rows) => {
            if(err){
                throw err; //catch will handle it
            }
            rows.forEach(row => {
                data.users.push({id: row.id, username: row.username, email: row.email, password_hash: row.password_hash, created_at: row.created_at});
            });
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (err){
        console.log('GET ALL COMMENTS: ',err.message);
        res.status(400).send('GET ALL COMMENTS: ',err.message);
    }
});

//DELETE - specific user by user id
app.delete('/', (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM users WHERE id=?';
    try {
        DB.run(sql, [req.query.id], function(err){
            if(err) throw err;
            if(this.changes ===  1) {
                //1 item deleted (good)
                res.status(200).send("User was deleted!");
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
