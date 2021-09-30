const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const User = require('../../models/User');
const Stocks = require('../../models/stocks');

// @route   GET api/stocks/search
// @desc    Tests post route
// @access  Public
router.get('/search', (req, res) => {
    axios.get(`https://finnhub.io/api/v1/search?q=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ msg: 'stocks Works', response: response.data })
        })
        .catch((err) => res.status(404).json(err))
});

// @route   GET api/stocks/getStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getStockInfo',passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('getStockInfo', req.query.name)
    axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.name}&resolution=D&from=1611769728&to=1615302599&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ msg: 'stocks Works', response: response.data })
        })
        .catch((err) => res.status(404).json(err))
});

// @route   GET api/stocks/getCurrentStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getCurrentStockInfo',passport.authenticate('jwt', { session: false }), (req, res) => {
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            console.log('stocks data', response.data);
            res.json({ msg: 'getCurrentStockInfo Works', response: response.data })
        })
        .catch((err) => res.status(404).json(err))
});

// @route   GET api/stocks/livePrices
// @desc    Tests post route
// @access  Private
router.get('/livePrices',passport.authenticate('jwt', { session: false }), (req, res) => {
    const d = new Date();
    Stocks.find({ 'date': { '$gt': new Date(d.toDateString()) } })
        .then((allstocks) => {
            const liveStocksData = allstocks.reduce(function (acc, cur, i) {
                acc[cur['stock_symbol']] = cur['current'];
                return acc;
            }, {});
            return res.status(200).json({ liveStocksData })
        })
        .catch((err) => {
            console.log('alsstocks err', err)
            res.status(404).json(err)
        })
});




module.exports = router;
