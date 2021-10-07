// const Transactions = require('../models/transactions');
const Order = require('../../models/order');
const User = require('../../models/user');
const request = require('request')

router.get('/closetheday', (req, res) => {
    checkUserTransactions()
});


checkUserTransactions =() => {
    console.log('checkUserTransactions');
    let users = [];
    User.find()
        .then((users) => {
            console.log('users', users);
            users = users
        })
    const d = new Date();
    users.map((el) => {
        Order.find({ 'user_id': '61416c75ec81a683eaf7aa94', 'date': { '$gt': new Date('2021-09-28') } })
            .sort({ date: -1 })
            .then(orders => {
                console.log('orders', orders.length)
                compileTodaysSummary(orders)
            })
            .catch(err =>
                console.log({ nopostfound: 'No post found with that ID' })
            );
    })
}

const updateClosingPriceOfStock = (stock_symbol) =>{
    return new Promise((resolve,reject)=>{
        request({
            url: `http://localhost:5000/api/stocks/getLiveStockInfo?name=${stock_symbol}`, //on 3000 put your port no.
            method: 'GET',
        }, function (error, response, body) {
            if(error){
                console.log({error})
                reject(error)
            }
            else{
                resolve(body)
            }
            console.log({error: error, response: response, body: body});
        });
    })
   
}


const compileTodaysSummary = async (summary) => {
    let total_investment_of_day = 0
    let return_on_investment_of_day = 0
    summary.map(async(el) => {
        const { _id, quantity, order_price, investment,stock_name,stock_symbol } = el || {}
        // api call to fetch closing price
        let close_price = 0
        try{
            day_end_data = await updateClosingPriceOfStock(stock_symbol);
            close_price = day_end_data.response.c
        }
        catch(e){
            console.log('error for stock ',e)
        }
        total_investment_of_day += Number(investment);
        return_on_investment_of_day += quantity * close_price;
        const profit_loss = close_price > order_price ? 'LOSS' : 'PROFIT';
        const percentage_change = (close_price - order_price) / order_price;
        const earnings = (close_price - order_price) * quantity;
        const update_info_of_order = {
            change: percentage_change,
            earnings,
            close_price,
            current_price: close_price,
            profit_loss,
            _id
        }
        closeTradingForDay(update_info_of_order);
        // createTransactionForDay({total_investment_of_day,return_on_investment_of_day})
    })
}


const closeTradingForDay = (data) => {
    console.log('closeTradingForDay',data)
    const { _id, change, earnings, close_price, current_price, profit_loss } = data
    Order.updateOne({ "_id": _id },
        { $set: { change, earnings, close_price, current_price, profit_loss } })
        .then((newdata) => {
            console.log('closeTradingForDay update',data)
            res.status(200).json(newdata)
        })
        .catch((err) => res.status(400))
}


const createTransactionForDay = (data) =>{
    const {total_investment_of_day,return_on_investment_of_day} = data
    const date= new Date();
    const action = return_on_investment_of_day > total_investment_of_day? 'PROFIT': 'LOSS';
    const profit_loss = (return_on_investment_of_day - total_investment_of_day)/total_investment_of_day;
    // const final_balance = 
    console.log('createTransactionForDay',data)
}