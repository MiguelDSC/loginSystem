import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";

const posts = [
  {
    username: "test",
    title: "POST 1",
  },

  {
    username: "miguel",
    title: "POST 2",
  },
];

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.VITE_PORT || 3500;

const con = await mysql.createConnection({
  host: "localhost",
  database: "loginSystem",
  user: "root",
  password: "",
});

con.connect((err) => {
  if (err) throw err;
  console.log("connected to database!");
});

app.get("/posts", authenticateToken, async (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", async (req, res) => {
  const result = await con.query(
    `SELECT * FROM User WHERE User.username = "${req.body.username}"`
  );
  if (result[0].length === 0) res.sendStatus(404);

  try {
    const foundUser = result[0][0];
    if (await bcrypt.compare(req.body.password, foundUser.password)) {
      const username = req.body.username;

      const user = {
        username: username,
      };

      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);

      res.setHeader("Set-Cookie", [
        `accessToken=${accessToken}; HttpOnly; Max-Age=${60000 * 15};`,
        `refreshToken=${refreshTokens}; HttpOnly; Max-Age=${60000 * 15};`,
      ]);

      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    throw e;
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60s" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

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
      `INSERT INTO User (username, password) VALUES ('${newUser.username}', '${newUser.password}')`
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

    if (result[0].length === 0) return false;

    return true;
  } catch (e) {
    throw e;
  }
};

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
