const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// User model
const User = require('../models/User');


// @route   GET api/profile/myprofile
// @desc    Get post by id
// @access  Private to users logged in
router.get(
  '/myprofile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.status(200).json({ succes: true, user: req.user });
  },
);


module.exports = router;
