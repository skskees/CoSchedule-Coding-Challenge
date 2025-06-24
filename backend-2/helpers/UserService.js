class UserService {
  constructor(db) {
    this.db = db;
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isUsernameTaken(username, callback) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    this.db.get(sql, [username], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, !!row);
    });
  }
}

export default UserService;
