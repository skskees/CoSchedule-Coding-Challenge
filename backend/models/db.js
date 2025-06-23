import sqlite3 from 'sqlite3';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  constructor(filepath) {
    this.db = new sqlite3.Database(filepath, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err);
      } else {
        console.log('Connected to database');
      }
    });

    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
    this.exec = promisify(this.db.exec.bind(this.db));
  }

  close() {
    return promisify(this.db.close.bind(this.db))();
  }
}

const dbPath = path.resolve(__dirname, '../dev.sqlite3');
const db = new Database(dbPath);

export default db;
