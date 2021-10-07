const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');
const Transactions = require('../../models/transactions');

// @route   GET api/passbook/data
// @desc    Get post by id
// @access  Private to users logged in
router.post('/recharge', passport.authenticate('jwt', { session: false }), (req, res) => {
    // return res.json(req.user)
    // console.log('user_id',req.user._id)
    // const d = new Date();
    const amount = req.user.wallet_balance;
    const user_id = req.user._id;
    const profit_loss = 'NA';
    const action = 'Recharge'
    const final_balance = Number(amount) + Number(req.body.rechargeAmount)
    console.log('recharge',req.query,req.body)
    const transactions = new Transactions({
        user_id,  amount, final_balance, profit_loss, action
     })
     transactions.save().then((response)=>{
         console.log('transaction craeted')
         updateWallentBalance(req.user,req.body.rechargeAmount)
         return res.status(200).json({sucess:true})
     })
     .catch((err)=>{
         console.log('transaction failed',err)
         return res.status(400).json({sucess:false})
     })


});

router.get('/withdrawl', passport.authenticate('jwt', { session: false }), (req, res) => {
    // return res.json(req.user)
    // console.log('user_id',req.user._id)
    // return res.json(req.user)
    // const d = new Date();
    User.find({ 'user_id': req.user._id})
        .sort({ date: -1 })
        .then(order => {
            res.json(order)
        })
        .catch(err =>
            res.status(404).json({ noordertfound: 'No orders found with that ID', err })
        );
});


const updateWallentBalance = (user, investment) => {
    console.log('updateWallentBalance',user, investment)
    const { _id, wallet_balance } = user
    const newBalance = Number(wallet_balance) + Number(investment)
    User.updateOne({ '_id': _id }, { $set: { wallet_balance: newBalance } })
        .then(res => console.log('wallet updated', res))
        .catch(err => console.log('wallet update failed', err))
}

module.exports = router;