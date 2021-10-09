const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const TransactionsScehma = new Schema({
    user_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default:  Date.now()
    },
    amount: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    final_balance: {
        type: Number,
        required: true,
    },
    profit_loss: {
        type:  String,
        required: false,
        default: 'NA'
    }
});

module.exports = Transactions = mongoose.model('Transactions', TransactionsScehma);