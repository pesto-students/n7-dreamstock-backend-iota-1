const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');
const Order = require('../../models/order');
const Stocks = require('../../models/stocks')
const moment = require('moment')



// @route   GET api/dashboard/mydashboard
// @desc    Get post by id
// @access  Private to users logged in
router.get('/myDashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    // return res.json(req.user)
    // console.log('user_id',req.user._id)
    // return res.json(req.user)
    const d = moment().format('YYYY-MM-DD');
    console.log('dashboard date',d, req.user._id)
    Order.find({ 'user_id': req.user._id })
        .sort({ date: -1 })
        .then(order => {
            console.log('mydashboard',order)
            res.json(order)
        })
        .catch(err =>{
            console.log('err mydashboard',err)
            return res.status(404).json({ noordertfound: 'No orders found with that ID', err })
        })
});


// @route   GET api/dashboard/summary
// @desc    Get post by id
// @access  Private to users logged in
router.get('/summary', passport.authenticate('jwt', { session: false }), (req, res) => {
    Order.find({ 'user_id': req.user._id })
        .sort({ date: -1 })
        .then(orders => {
            console.log('orders', orders)
            const finalData = []
            const obj = {};
            const data = {};
            let portfolioCurrentValue = 0
            for (let i = 0; i < orders.length; i++) {
                let date = orders[0].date.toJSON().split('T')[0]
                const { current_price, order_price, quantity } = orders[i]
                const perOrderProfit = (current_price - order_price) * quantity
                portfolioCurrentValue += perOrderProfit
                if (obj[date]) {
                    obj[date]['data'].push(orders[i])
                    obj[date]['total_cost'] += Number(orders[i].investment)
                    obj[date]['portfolioCurrentValue'] += (Number(orders[i].quantity) * Number(orders[i].current_price))
                    // obj[date]['profit_loss'] = (portfolioCurrentValue - obj[date]['total_cost'])/obj[date]['total_cost']
                }
                else {
                    obj[date] = { date }
                    obj[date]['data'] = [orders[i]]
                    obj[date]['total_cost'] = Number(orders[i].investment)
                    obj[date]['profit_loss'] = "+10%"
                    obj[date]['portfolioCurrentValue'] = (Number(orders[i].quantity) * Number(orders[i].current_price))
                    // obj[date]['portfolioCurrentValue'] == Number(orders[i].investment)

                }
            }
            Object.keys(obj).map((el) => finalData.push(obj[el]))
            res.json({ finalData })
        })
        .catch(err => {
            console.log('summary', err)
            res.status(404).json({ nopostfound: 'No post found with that ID' })
        }
        );
});


// @route   GET api/dashboard/create_order
// @desc    Create post
// @access  Private
router.post(
    '/create_order',
    passport.authenticate('jwt', { session: false }),
    async(req, res) => {
        // const { errors, isValid } = validateInput(req.body);
        // // Check Validation
        // if (!isValid) {
        //     // If any errors, send 400 with errors object
        //     return res.status(400).json(errors);
        // }
        const user_id = req.user._id
        let newOrder;
        const payload = req.body.data;
        let total = 0
        payload.forEach((el)=>{total+=Number(el.investment)})
        console.log('total',total,Number(req.user.wallet_balance))
        if (Number(req.user.wallet_balance) < total) {
            return res.status(400).json({ success: 'false', detail: 'Not sufficient wallet balance' })
        }
        const response = [];
        let arr =[]
        const game_date = moment().format('d')
        await payload.forEach(async (el) => {
            const { stock_name, stock_symbol, open, investment, quantity, order_price, close_price, change, profit_loss, current_price, earnings } = el || {}
            newOrder = new Order({
                user_id, stock_name, stock_symbol, investment, quantity, order_price, close_price, change, profit_loss, current_price, earnings
            });

            await newOrder
                .save()
                .then(async (order) => {
                    response.push(order)
                })
                .catch(err => console.log(err));
            if(!arr.includes(stock_symbol)){
                arr.push(stock_symbol)
            Stocks.find({ "stock_symbol": stock_symbol })
                .then(async (stocksdata) => {
                    if (stocksdata.length == 0) {
                        await createStockEntry(el)
                    }
                })
            }
        });
        updateWallentBalance(req.user, total)
        return res.status(200).json({ success: 'true', order: payload });
    }
);


const createStockEntry = async (data) => {
    const { stock_name, stock_symbol, open, order_price } = data || {}
    const newStock = new Stocks({
        stock_name, stock_symbol, open, current: order_price
    })
    await newStock.save()
}

const updateWallentBalance = (user, investment) => {
        console.log('updateWallentBalance',user,investment)
        const { _id, wallet_balance } = user
    const newBalance = Number(wallet_balance) - Number(investment)
    User.updateOne({ '_id': _id }, { $set: { wallet_balance: newBalance } })
        .then(res => console.log('wallet updated', res))
        .catch(err => console.log('wallet update failed', err))
}

module.exports = router;
