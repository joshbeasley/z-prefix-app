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

app.set('trust proxy', 1);
app.use(session({
  store,
  secret: process.env.SESSION_SECRET || 'mySecret',
  saveUninitialized: false,
  resave: false,
  name: 'sessionId',
  cookie: {
    secure: true,
    httpOnly: true, 
    maxAge: 1000 * 60 * 30, 
    sameSite: 'lax',
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.UI_URL || 'http://localhost:3000', process.env.API_URL || 'http://localhost:8080'],
    credentials: true,
  })
);

app.post("/register", async (req, res) => {
  const maxIdQuery = await knex('users').max('id as maxId').first();
  let id = maxIdQuery.maxId + 1;
  let { body } = req;
  let { firstName, lastName, username, password } = body;

  if (!username || !password) {
    res.status(400).json("Missing username or password");
    return;
  }

  try {
    const passwordHash = await hash(password, saltRounds);
    await knex("users").insert({ id, firstName, lastName, username, passwordHash });
    res.status(201).json("USER CREATED");
  } catch(err) {
    if (err.code === '23505') {
      console.log(err)
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
    const data = await knex("users").where({ username });
    const hashedPass = data[0].passwordHash
    const isMatch = await compare(password, hashedPass);
    if (isMatch) {
      console.log(data[0]);
      req.session.authenticated = true;
      req.session.user = data[0];
      res.status(202).json(req.session);
    }
    else res.status(401).json("Incorrect password");
  } catch(err) {
    res.status(500).json("Username does not exist")
  }
})

app.delete('/logout', (req, res) => {
  console.log(req.session)
  if (req.session.user) {
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

// middleware to ensure that only authenticated users can perform the action
const validSession = (req, res, next) => {
  console.log(req.session);
  if (!req.session || !req.session.user) {
      res.status(401).json("You shall not pass")
  } else {
    next();
  }
}

app.get("/items", async (req, res) => {
  try {
    const items = await knex("items").join("users", "users.id", "=", "items.userId").select("items.id", "items.itemName", "items.description", "items.quantity", "items.userId", "users.lastName", "users.firstName");
    res.status(200).send(items);
  } catch(err) {
    console.log(err);
    res.status(404).json("No items found");
  }
})

app.post("/items", validSession, async (req, res) => {
  const maxIdQuery = await knex('items').max('id as maxId').first();
  let id = maxIdQuery.maxId + 1;
  try {
    let { body } = req;
    await knex("items").insert({...body, id});
    res.status(201).json("ITEM CREATED");
  } catch(err) {
    console.log(err);
    if (err.code === '22001') {
      res.status(500).json("Description field exceeds 255 characters");
    } else {
      res.status(500).json("Bad request");
    }
  }
})

app.put("/items/:id", validSession, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let { body } = req;
    await knex("items").where('id', id).update(body);
    res.status(201).json("ITEM UPDATED");
  } catch(err) {
    console.log(err);
    if (err.code === '22001') {
      res.status(500).json("Description field exceeds 255 characters");
    } else {
      res.status(500).json("Bad request");
    }
  }
})

app.delete("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await knex('items').where('id', id).del();
    res.status(202).send(`Item with id ${id} successfully deleted.`)
  } catch(err) {
    console.log(err);
    res.status(400).send('There was an error processing your request.');
  }
})

module.exports = app;

