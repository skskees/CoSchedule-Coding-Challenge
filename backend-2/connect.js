import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();

const DB = new sql3.Database('./codechallenge.db', sqlite3.OPEN_READWRITE, connected);

function connected(err){
    if(err){
        console.log(err.message);
        return;
    }
    console.log('Connected to DB or SQLite DB already exists!')
    //enable foreign keys!
    DB.run("PRAGMA foreign_keys = ON");
}

//users
let users = `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME NOT NULL
)`;
DB.run(users, [], (err) => {
    if(err) {
        console.log('error creating sql: ',err);
        return;
    }
    console.log('CREATED TABLE: users')
});

//giphy items
let giphy_items = `CREATE TABLE IF NOT EXISTS giphy_items(
    id INTEGER PRIMARY KEY,
    giphy_id TEXT UNIQUE NOT NULL,
    title TEXT,
    url TEXT,
    data_blob TEXT,
    cached_at DATETIME NOT NULL
)`;
DB.run(giphy_items, [], (err) => {
    if(err) {
        console.log('error creating sql: ',err);
        return;
    }
    console.log('CREATED TABLE: giphy_items')
});

//ratings
let ratings = `CREATE TABLE IF NOT EXISTS ratings(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    giphy_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (giphy_id) REFERENCES giphy_items(id) ON DELETE CASCADE
)`;
DB.run(ratings, [], (err) => {
    if(err) {
        console.log('error creating sql: ',err);
        return;
    }
    console.log('CREATED TABLE: ratings')
});

//comments
let comments = `CREATE TABLE IF NOT EXISTS comments(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    giphy_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (giphy_id) REFERENCES giphy_items(id) ON DELETE CASCADE
)`;
DB.run(comments, [], (err) => {
    if(err) {
        console.log('error creating sql: ',err);
        return;
    }
    console.log('CREATED TABLE: comments')
});

export {DB};