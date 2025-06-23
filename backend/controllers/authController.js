import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';  // Note the .js extension!
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export async function registerUser(req, res)  {
    const {username, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10); 
        await userModel.createUser(username, email, hash);
        res.status(201).json({message: 'User registered!'});
    } catch (err) {
        console.error(err);
        res.status(400).json({error: 'Error creating user.'});
    }
};

export async function login(req, res) {
    const {username, password} = req.body;
    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) return res.status(400).json({error: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({error: 'Invalid credentials'});

        const token = jwt.sign({id: user.id, username: user.username}, SECRET, {expiresIn: '1d'}); 
        res.json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};