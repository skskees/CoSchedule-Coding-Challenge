import db from './db.js';

class UserService {
  static isValidEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static async createUser(username, email, password_hash) {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username');
    }

    if (!UserService.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password_hash || typeof password_hash !== 'string') {
      throw new Error('Invalid password hash');
    }

    try {
      const result = await db.run(
        `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
        [username, email, password_hash]
      );
      console.log('User created');
      return result; // Note: sqlite3 `run()` doesn't return lastID automatically with promisify
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  static async findUserByUsername(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username');
    }

    try {
      const user = await db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );
      return user;
    } catch (err) {
      console.error('Error finding user:', err);
      throw err;
    }
  }
}

export default UserService;
