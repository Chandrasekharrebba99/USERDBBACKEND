const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("UserDataBase.db");
// Create users table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
)`
  );
});
