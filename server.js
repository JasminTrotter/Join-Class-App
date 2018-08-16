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

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);

console.log(__dirname);
app.use(express.static(__dirname + '/public'));


const jwtAuth = passport.authenticate('jwt', { session: false });


const reservationsRouter = require('./reservationsRouter');
app.use('/current-reservations/', reservationsRouter);



//PROTECTED ENDPOINTS
//A protected endpoint to create reservation
app.post('/join-a-class', jwtAuth, (req, res) => {

  Reservations.create({
    id: req.body.id,
    class: req.body.class,
    time: req.body.time, 
    day: req.body.day,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    length: req.body.length,
    userId: req.body.userId
  })
  .then((post) => {
    res.json(post.serialize())
  }); 
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

