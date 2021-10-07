const Transactions = require('../models/transactions');
const Order = require('../models/order');
// const User = require('../models/user');
const Stocks = require('../models/stocks');
const moment = require('moment')

module.exports = function trycheckUserTransactions() {
    checkUserTransactions()
}
checkUserTransactions = async () => {
    console.log('checkUserTransactions started');
    let usersDB = [];
    await User.find()
        .then((users) => {
            usersDB = users
        })
    const d = new Date();
    let todaysUsedStocks = {}
    await Stocks.find()
        .then((allStocks) => {
            todaysUsedStocks = allStocks.reduce(function (acc, cur, i) {
                acc[cur['stock_symbol']] = cur;
                return acc;
            }, {});
        })
    usersDB.map((el) => {
        Order.find({ 'user_id': el._id, 'date': { '$gt': new Date(moment().format('YYYY-MM-DD')) } })
            .sort({ date: -1 })
            .then(orders => {
                console.log('compileTodaysSummary', orders,todaysUsedStocks,el)
                if(orders.length>0){
                compileTodaysSummary(orders, todaysUsedStocks, el)
                }
            })
            .catch(err =>
                console.log({ nopostfound: 'No post found with that ID' })
            );
    })
}



const compileTodaysSummary = async (summary, todaysUsedStocks, userDetail) => {
    let total_investment_of_day = 0
    let return_on_investment_of_day = 0
    summary.map(async (el) => {
        const { _id, quantity, order_price, investment, stock_name, stock_symbol } = el || {}
        let close_price = todaysUsedStocks[stock_symbol]['current']
        total_investment_of_day += Number(investment);
        return_on_investment_of_day += quantity * close_price;
        const profit_loss = close_price < order_price ? 'LOSS' : 'PROFIT';
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
        console.log('compoilied', update_info_of_order)
        closeTradingForDay(update_info_of_order);
    })
    createTransactionForDay({ total_investment_of_day, return_on_investment_of_day }, userDetail)
}

const closeTradingForDay = (data) => {
    const { _id, change, earnings, close_price, current_price, profit_loss } = data
    Order.updateOne({ "_id": _id },
        { $set: { change, earnings, close_price, current_price, profit_loss } })
        .then((newdata) => {
            console.log('closeTradingForDay update', newdata)
        })
        .catch((err) => console.log('closing for today has err', err))
}


const createTransactionForDay = (data, userDetail) => {
    console.log('createTransactionForDay ->>',data, userDetail)
    const { total_investment_of_day, return_on_investment_of_day } = data
    const action = return_on_investment_of_day > total_investment_of_day ? 'PROFIT' : 'LOSS';
    const profit_loss = (return_on_investment_of_day - total_investment_of_day);
    const final_balance = Number(return_on_investment_of_day) + Number(userDetail.wallet_balance);
    const amount = Number(userDetail.wallet_balance) + Number(total_investment_of_day);
    const transactions = new Transactions({
       user_id:userDetail._id,  amount, final_balance, profit_loss, action
    })
    transactions.save()
    console.log('createTransactionForDay', {amount, final_balance, profit_loss, action})
    updateWalletBalance(userDetail, final_balance)
}

const updateWalletBalance = (userDetail, final_balance) => {
    User.update({ "_id": userDetail._id }, { $set: { wallet_balance: final_balance } })
        .then((newdata) => {
            console.log('closing for today updateWalletBalance', newdata)
        })
        .catch((err) => console.log('closing for today updateWalletBalance err', err))
}