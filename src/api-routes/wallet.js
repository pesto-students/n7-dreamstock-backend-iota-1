const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Transactions = require('../models/transactions');
const { userDefaults } = require('../config/constants');

// @route   GET api/wallet/recharge
// @desc    Get post by id
// @access  Private to users logged in
router.post('/recharge', passport.authenticate('jwt', { session: false }), (req, res) => {

  const amount = req.user.wallet_balance;
  const user_id = req.user._id;
  const action = 'RECHARGE';
  const final_balance = Number(amount) + (Number(req.body.transactionAmount)*1000);
  const transactions = new Transactions({
    user_id, amount, final_balance, action,
  });
  transactions.save().then((response) => {
    updateWallentBalance(req.user, final_balance);
    return res.status(200).json({ sucess: true, wallet_balance: final_balance });
  })
    .catch((error) => {
      console.log('transaction failed', error);
      return res.status(400).json({ sucess: false, error });
    });
});


// @route   GET api/wallet/withdrawl
// @desc    Get post by id
// @access  Private to users logged in
router.post('/withdrawl', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { transactionAmount } = req.body
  const { default_balance } = userDefaults
  const amount = req.user.wallet_balance;
  const withdrwalApproved = default_balance < amount && Number(transactionAmount) <= (amount-default_balance)
  if (!withdrwalApproved){
    return res.status(200).json({ sucess: false, error:'Insufficient balance for withdrawl' });
  }
  const user_id = req.user._id;
  const action = 'WITHDRAWL';
  const final_balance = Number(amount) - Number(transactionAmount);
  const transactions = new Transactions({
    user_id, amount, final_balance, action,
  });
  transactions.save().then((response) => {
    updateWallentBalance(req.user, final_balance);
    return res.status(200).json({ sucess: true, wallet_balance: final_balance });
  })
    .catch((error) => {
      console.log('transaction failed', error);
      return res.status(400).json({ sucess: false, error });
    });
});


// @route   GET api/wallet/info
// @desc    Get post by id
// @access  Private to users logged in
router.get('/info', passport.authenticate('jwt', { session: false }), (req, res) => {

  User.findOne({ _id: req.user._id })
    .then(user => {
      return res.status(200).json({ success: true, wallet_balance: user.wallet_balance });
    })
    .catch(err => console.log('wallet update failed', err));
});


const updateWallentBalance = (user, final_balance) => {
  User.updateOne({ _id: user._id }, { $set: { wallet_balance: final_balance } })
    .then(res => console.log('wallet updated', res))
    .catch(err => console.log('wallet update failed', err));
};

module.exports = router;
