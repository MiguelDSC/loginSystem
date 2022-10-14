import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3500;

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
  console.log("incoming details: ", req.body);
  const username = req.body.username;
  const password = req.body.password;
  con.query(
    `SELECT * FROM user WHERE user.username = '${username}' AND user.password = '${password}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(200);
    }
  );
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
