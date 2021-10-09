const Transactions = require('../models/transactions');
const express = require('express');
const router = express.Router();
const passport = require('passport');

// @route   GET api/passbook/data
// @desc    Get post by id
// @access  Private to users logged in
router.get('/data', passport.authenticate('jwt', { session: false }), (req, res) => {
  Transactions.find({ user_id: req.user._id})
    .sort({ date: -1 })
    .then(order => {
      res.status(200).json({sucess: true, order});
    })
    .catch(error =>
      res.status(400).json({ sucess: false, error }),
    );
});

module.exports = router;
