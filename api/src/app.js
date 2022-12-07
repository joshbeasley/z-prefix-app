const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const cors = require('cors');
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const app = express();

const env = process.env.NODE_ENV || 'development'
const config = require('../knexfile')[env]
const knex = require('knex')(config)

const saltRounds = 12; 
const { hash, compare } = bcrypt;

app.use(session({
  store,
  secret: process.env.SESSION_SECRET || 'mySecret',
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: env === 'development' ? false : true, // if true: only transmit cookie over https, in prod, always activate this
    httpOnly: true, 
    maxAge: 1000 * 60 * 30, 
    sameSite: 'lax',
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());  

app.post("/register", async (req, res) => {
  let { body } = req;
  let { username, password } = body;

  if (!username || !password) {
    res.status(400).json("Missing username or password");
    return;
  }

  try {
    const passwordHash = await hash(password, saltRounds);
    await knex("users").insert({ username, passwordHash });
    console.log("hit")
    res.status(201).json("USER CREATED");
  } catch(err) {
    if (err.code === '23505') {
      res.status(403).json("User already exists");
    } else {
      res.status(500).json(err);
    }
  }
});

app.post("/login", async (req, res) => {
  let { body } = req;
  let { username, password } = body;

  if (!username || !password) {
    res.status(400).json("Missing username or password");
    return;
  }

  try {
    if (req.session.autheticated) {
      res.status(200).json(req.session);
      return;
    } 

    const data = await knex("users").where({ username });
    const hashedPass = data[0].passwordHash
    const isMatch = await compare(password, hashedPass);
    if (isMatch) {
      req.session.authenticated = true;
      req.session.userId = data[0].id;
      res.status(202).json(req.session);
    }
    else res.status(401).json("Incorrect password");
  } catch(err) {
    res.status(500).json("Username does not exist")
  }
})

app.delete('/logout', (req, res) => {
  console.log(req.session)
  if (req.session.userId) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).json('Unable to log out')
      } else {
        res.status(202).json('Logout successful')
      }
    });
  } else {
    res.status(202).json('Logout successful')
  }
})

const validSession = (req, res, next) => {
  console.log(req.session);
  if (!req.session || !req.session.userId) {
      res.status(401).json("You shall not pass")
  } else {
    next();
  }
}

app.get("/protected", validSession, (req, res) => {
  res.send("You are authenticated");
})

module.exports = app;

