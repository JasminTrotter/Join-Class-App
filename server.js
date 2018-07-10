'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


const { DATABASE_URL, PORT } = require('./config');
const { Reservations } = require('./models');

const app = express();

//logging
app.use(morgan('common'));

app.use(express.json());
//app.use(express.static('public'));

const jwt = require('jsonwebtoken');
const config = require('./config');

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });


//PROTECTED ENDPOINTS

//A protected endpoint to create reservation
app.post('/api/join-a-class', jwtAuth, (req, res) => {
//  jwt.verify(req.token, config.JWT_SECRET, (err) => {
//    if(err) {
//     res.sendStatus(403);
//    } else {

//    }

        Reservations.create({
        id: req.body.id,
        class: req.body.class,
        time: req.body.time, 
        day: req.body.day,
        date: req.body.date,
        location: req.body.location
  })
  .then((post) => {
    res.json(post.serialize())
  }); 
});


//A protected endpoint to view current reservations
app.get('/api/current-reservations', jwtAuth, (req, res) => {
    Reservations
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.delete('/api/current-reservations/:id', jwtAuth, (req, res) => {
  Reservations.findByIdAndRemove(req.params.id)
  .then(result => res.json(result))
});



app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };

