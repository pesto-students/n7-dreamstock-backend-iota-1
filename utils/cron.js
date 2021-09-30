const request = require('request')
const Stocks = require('../models/stocks');

module.exports = function updateStocksLivePrice() {
    console.log('updateStocksLivePrice');
    Stocks.find()
    .then(async (allStocks)=>{
        console.log('allStocks',allStocks)
        allStocks.map(async (el)=>{
            const current = await updateLivePriceOfStock(el.stock_symbol)
            let x =JSON.parse(current)
            console.log('current',x.response.c)
            Stocks.updateOne({"stock_symbol": el.stock_symbol},
            { $set: { current:x.response.c+100 } })
            .then((newdata) => {
                console.log('updateLivePriceOfStock')
            })
            .catch((err) => res.status(400))
        })
    })
}


const updateLivePriceOfStock = (stock_symbol) =>{
    return new Promise((resolve,reject)=>{
        request({
            url: `http://localhost:5000/api/stocks/getCurrentStockInfo?name=${stock_symbol}`, //on 3000 put your port no.
            method: 'GET',
        }, function (error, response, body) {
            if(error){
                console.log('updateClosingPriceOfStock',error)
                reject(error)
            }
            else{
                resolve(body)
            }
            console.log({error: error, response: response, body: body});
        });
    })
   
}