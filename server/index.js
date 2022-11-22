import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.VITE_PORT || 3500;

const con = mysql.createConnection(process.env.DATABASE_URL);

con.connect((err) => {
  if (err) throw err;
  console.log("connected to database!");
});

app.get("/users", (req, res) => {
  console.log("recieved request for user list");
  con.query("SELECT * FROM user", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/login", (req, res) => {
  con.query(
    `SELECT * FROM user WHERE user.username = "${req.body.username}"`,
    async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.sendStatus(404);
        return;
      }

      try {
        if (await bcrypt.compare(req.body.password, result[0].password)) {
          res.sendStatus(200);
          return;
        }
      } catch {
        res.sendStatus(500);
      }
    }
  );
});

app.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      username: req.body.username,
      password: hashedPassword,
    };

    con.query(
      `INSERT INTO user (username, password) VALUES ('${newUser.username}', '${newUser.password}')`,
      (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(201);
      }
    );
  } catch (e) {
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
