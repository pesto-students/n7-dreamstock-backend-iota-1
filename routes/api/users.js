const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


// Load User model
const User = require('../../models/User');


// @route   POST api/users/manualregister
// @desc    Register user
// @access  Public
router.post('/manualregister', (req, res) => {
  console.log('manualregister',req.body)

  // Check Validation
  
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      console.log('USER exist')
      return res.status(400).json(errors);
    } else {
      const { first_name, last_name, email } = req.body
      const newUser = new User({
        first_name, last_name, email
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
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    // Sign Token
    const payload = { id: user.id, iat:Date.now()}; // Create JWT Payload
    console.log("Login Payload", payload)

    jwt.sign(
      payload,
      keys.secretOrKey,
      (err, token) => {
        console.log('token',err,token)
        res.json({
          success: true,
          token: 'Bearer ' + token,
        });
      }
    );
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('authenticated',req.headers.authorization)
    jwt.verify(req.headers.authorization.split(' ')[1], keys.secretOrKey, function (err, decoded) {
      if (err) {
        console.log('err', err)
        return res.status(404).json(err);
      }
      else {
        console.log('not expired',decoded);
    return res.json({user:req.user})

      }
    })
  }
);



module.exports = router;
