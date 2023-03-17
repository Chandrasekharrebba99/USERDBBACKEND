const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());
const port = 8080;

const dbPath = path.join(__dirname, "UserDataBase.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.post("/api/v1/say-hello", async (request, response) => {
  const { firstName, lastName } = request.body;

  const selectUserQuery = `SELECT * FROM users WHERE first_name = '${firstName}' and last_name='${lastName}'`;
  const dbUser = await db.get(selectUserQuery);
  if (firstName.length === 0 || lastName.length == 0) {
    response.send("Your Inputs are Empty");
  } else if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO
          users (first_name,last_name)
        VALUES
          (
            '${firstName}',
            '${lastName}'
          );`;
    const dbResponse = await db.run(createUserQuery);
    const message = { message: `Hi ${firstName}, Welome to Chatelon!` };
    response.status(200);
    response.send(message);
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.get("/api/v1/names", async (req, res) => {
  const AllUsers = "SELECT * FROM users;";
  const dbResponse = await db.all(AllUsers);
  res.send(dbResponse);
});

app.get("/", (req, res) => {
  res.send("HElloworsl");
});

app.put("/api/v1/:id/", async (request, response) => {
  const { id } = request.params;
  const { firstName, lastName } = request.body;
  const updatePlayerQuery = `
    UPDATE
       users
    SET
      first_name = '${firstName}',
      last_name = '${lastName}'
    WHERE
      id = ${id};`;
  await db.run(updatePlayerQuery);
  response.send("User Details Updated");
});

app.delete("/api/v1/:id/", async (request, response) => {
  const { id } = request.params;
  const deleteUSer = `
    DELETE FROM
      users
    WHERE
      id = ${id};`;
  await db.run(deleteUSer);
  response.send("Delete User");
});
