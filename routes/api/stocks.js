const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const User = require('../../models/User');
const Stocks = require('../../models/stocks');
const moment = require('moment');

// @route   GET api/stocks/search
// @desc    Tests post route
// @access  Public
router.get('/search', (req, res) => {
    axios.get(`https://finnhub.io/api/v1/search?q=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ msg: 'stocks Works', response: response.data })
        })
        .catch((err) => {
            console.log('searcherr',err)
            res.status(404).json(err)
        })
});

// @route   GET api/stocks/getStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getStockInfo', (req, res) => {
    console.log('getStockInfo', req.query.name)
    const today = moment().format('d')
    const from = moment().format('X') - 2629743;
    const to = moment().format('X') - 50400;
    axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.name}&resolution=D&from=${1631022248}&to=${1631627048}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            res.json({ msg: 'stocks Works', response: response.data })
        })
        .catch((err) => res.status(404).json(err))
});

// @route   GET api/stocks/getLiveStockInfo
// @desc    Tests post route
// @access  Private
router.get('/getLiveStockInfo', (req, res) => {
    const from = moment().subtract(7, 'days').format('X') - 50400 ;
    const to = moment().subtract(7, 'days').format('X') - 48400 ;
    // axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.name}&resolution=15&from=${from}&to=${to}&token=c4rs38iad3ic8b7csbtg`)
    axios.get(`https://finnhub.io/api//v1/quote?symbol=${req.query.name}&token=c4rs38iad3ic8b7csbtg`)
        .then((response) => {
            console.log('response',response)
            // let data = {}
            // for(items in response.data){
            //     data[items] = response.data[items][0]
            // }
            res.json({ msg: 'getLiveStockInfo Works', response: response.data })
        })
        .catch((err) => {
            console.log('err',err)
            res.status(404).json(err)
        })
});

// @route   GET api/stocks/livePrices
// @desc    Tests post route
// @access  Private
router.get('/livePrices',(req, res) => {
    Stocks.find({'date':{ '$gt': moment().format('YYYY-MM-DD') }})
        .then((allstocks) => {
            console.log('livePrices',allstocks)
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
