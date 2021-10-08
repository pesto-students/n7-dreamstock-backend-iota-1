const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const Stocks = require('../../models/stocks');
const moment = require('moment');

// @route   GET api/stocks/search
// @desc    Tests post route
// @access  Public
router.get('/search', passport.authenticate('jwt', { session: false }), (req, res) => {
    axios.get(`https://finnhub.io/api/v1/search?q=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ success: true, response: response.data })
        })
        .catch((error) => {
            console.log('error', error)
            res.status(400).json({ success: false, error })
        })
});

// @route   GET api/stocks/getStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getStockDetails',  passport.authenticate('jwt', { session: false }),(req, res) => {
    const today = moment().format('d')
    const from = moment().format('X') - 2629743;
    const to = moment().format('X') - 50400;
    axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.name}&resolution=D&from=${1631022248}&to=${1631627048}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ success: true,  response: response.data })
        })
        .catch((error) => {
            console.log('getStockDetails error', error)
            res.status(400).json({ success: false, error })
        })
});

// @route   GET api/stocks/getLiveStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getLiveStockInfo',  passport.authenticate('jwt', { session: false }),(req, res) => {
    const from = moment().subtract(7, 'days').format('X') - 50400;
    const to = moment().subtract(7, 'days').format('X') - 48400;
    // axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.name}&resolution=15&from=${from}&to=${to}&token=c4rs38iad3ic8b7csbtg`)
    axios.get(`https://finnhub.io/api//v1/quote?symbol=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            console.log('getLiveStockInfo response', response)
            if (response.data.error) {
                return res.status(400).json({ success: false, response: response.error })
            }
            const lastUpdateTime = moment.unix(response.data.t);
            if(moment().format('X')- lastUpdateTime > 2629743){
                return res.status(400).json({ success: false, error:'Stock Unlisted' })
            }
            return res.status(200).json({ success: true, response: response.data })
        })
        .catch((error) => {
            console.log('getLiveStockInfo error', error)
            res.status(400).json({ success: false, error })
        })
});

// @route   GET api/stocks/livePrices
// @desc    Tests post route
// @access  Private
router.get('/livePrices', passport.authenticate('jwt', { session: false }), (req, res) => {
    Stocks.find({ 'date': { '$gt': moment().format('YYYY-MM-DD') } })
        .then((allstocks) => {
            console.log('livePrices allstocks', allstocks)
            const liveStocksData = allstocks.reduce(function (acc, cur, i) {
                acc[cur['stock_symbol']] = cur['current'];
                return acc;
            }, {});
            return res.status(200).json({ success: true,liveStocksData })
        })
        .catch((error) => {
            console.log('livePrices error', error)
            res.status(400).json({ success: false, error })
        })
});

module.exports = router;
