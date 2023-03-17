const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const port = 3000;

const db = new sqlite3.Database("ChateleanUserDB.db");
// Create users table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL,last_name TEXT NOT NULL)"
  );
});

app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      users`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.post("/register/", async (request, response) => {
  const { firstname, lastname } = request.body;

  const selectUserQuery = `SELECT * FROM users WHERE first_name = '${firstname}' and last_name='${lastname}'`;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        users (first_name,last_name) 
      VALUES 
        (
          '${firstname}', 
          '${lastname}',
        )`;
    const dbResponse = await db.run(createUserQuery);
    response.status(200);
    response.send("User created successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.get("/", (req, res) => {
  res.send("HEllo World");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
