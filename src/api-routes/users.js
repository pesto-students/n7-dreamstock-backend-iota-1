const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {secredtJWT} = require('../config');
const passport = require('passport');
// Load User model
const User = require('../models/User');

const generateJwtToken = (data) => {
  // Sign Token
  return new Promise((resolve, reject) => {
    const payload = { id: data.id, user: data, iat: Date.now() }; // Create JWT Payload
    jwt.sign(
      payload,
      secredtJWT,
      (err, token) => {
        resolve({
          success: true,
          token: 'Bearer ' + token,
        });
      },
    );
  });

};

// @route   POST api/users/manualregister
// @desc    Register user
// @access  Public
router.post('/manualregister', (req, res) => {

  // Check Validation

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      console.log('USER exist');
      return res.status(400).json(errors);
    } else {

      const { first_name, last_name, email } = req.body;
      const newUser = new User({
        first_name, last_name, email,
      });
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;

  // Find user by email
  User.findOne({ email }).then(async user => {
    // Check for user
    if (!user) {
      // const errors = 'User not found';
      // return res.status(400).json(errors);
      const { givenName: first_name, familyName: last_name, email, googleId, imageUrl } = req.body;
      const newUser = new User({
        first_name, last_name, email, googleId, imageUrl,
      });
      newUser
        .save()
        .then(async userInfo => {
          const generatedToken = await generateJwtToken(userInfo);
          res.json(generatedToken);
        })
        .catch(err => console.log(err));
    } else {
      const generatedToken = await generateJwtToken(user);
      res.json(generatedToken);
    }
  })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// @route   GET api/users/user_info
// @desc    Return current user
// @access  Private
router.get(
  '/user_info',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({ user: req.user });
  },
);


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    jwt.verify(req.headers.authorization.split(' ')[1], secredtJWT, function(err, decoded) {
      if (err) {
        return res.status(400).json(err);
      } else {
        return res.json({ user: req.user });

      }
    });
  },
);


module.exports = router;
