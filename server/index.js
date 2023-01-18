import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.VITE_PORT || 3500;

const con = await mysql.createConnection(process.env.DATABASE_URL);

con.connect((err) => {
  if (err) throw err;
  console.log("connected to database!");
});

app.get("/users", (req, res) => {
  const result = con.query("SELECT * FROM user");
  if (err) throw err;
  res.send(result);
});

app.post("/login", async (req, res) => {
  const result = await con.query(
    `SELECT * FROM user WHERE user.username = "${req.body.username}"`
  );
  if (result[0].length === 0) {
    res.sendStatus(404);
    return;
  }

  try {
    if (await bcrypt.compare(req.body.password, result[0][0].password)) {
      res.sendStatus(200);
      const username = req.body.username;

      const user = {
        name: username,
      };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      console.log(accessToken);

      return;
    } else {
      res.sendStatus(404);
      return;
    }
  } catch (e) {
    throw e;
  }
});

app.post("/register", async (req, res) => {
  if (await checkIfUsernameIsTaken(req.body.username)) {
    res.sendStatus(409);
    return;
  }

  try {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      username: req.body.username,
      password: hashedPassword,
    };

    const result = await con.query(
      `INSERT INTO user (username, password) VALUES ('${newUser.username}', '${newUser.password}')`
    );
    if (result[0].length === 0) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
});

const checkIfUsernameIsTaken = async (name) => {
  try {
    const result = await con.query(
      `SELECT * FROM user WHERE user.username = "${name}"`
    );

    console.log(result.length);
    if (result[0].length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    throw e;
  }
};

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
