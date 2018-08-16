'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');


const { Reservations } = require('./models');

// const { router: usersRouter } = require('./users');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


const jwtAuth = passport.authenticate('jwt', { session: false });




//A protected endpoint to view current reservations
router.get('/:userId', jwtAuth, (req, res) => {
    Reservations
    .find({userId: req.params.userId})

    .then( posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});


router.delete('/:id', jwtAuth, (req, res) => {
  Reservations.findByIdAndRemove(req.params.id)
  .then(result => res.json(result))
});

module.exports = router;