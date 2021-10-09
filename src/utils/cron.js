const request = require('request');
const Stocks = require('../models/stocks');
const moment = require('moment');

module.exports = function updateStocksLivePrice() {
  const d = moment().format('YYYY-MM-DD');
  // console.log('date.check',d,new Date(d))
  Stocks.find({ date: { $gt: new Date(d) } }).then(async(allStocks) => {
    console.log('allStocks', allStocks);
    allStocks.map(async(el) => {
      const current = await updateLivePriceOfStock(el.stock_symbol);
      let x = JSON.parse(current);
      Stocks.updateOne(
        { stock_symbol: el.stock_symbol },
        { $set: { current: x.response.c + 10 } },
      )
        .then((newdata) => {
          console.log('updateLivePriceOfStock');
        })
        .catch((err) => res.status(400));
    });
  });
};

const updateLivePriceOfStock = (stock_symbol) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: `http://localhost:5000/api/stocks/getLiveStockInfo?name=${stock_symbol}`, // on 3000 put your port no.
        method: 'GET',
      },
      function(error, response, body) {
        if (error) {
          console.log('updateClosingPriceOfStock', error);
          reject(error);
        } else {
          console.log('updateLivePriceOfStock', body);
          resolve(body);
        }
        console.log({ error: error, response: response, body: body });
      },
    );
  });
};
