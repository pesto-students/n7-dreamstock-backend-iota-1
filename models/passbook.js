const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

// Create Schema
const PassBookSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    pofit_loss: {
        type: String,
        required: false,
        default: null
    },
    final_balance: {
        type: String,
        required: true
    },
    success_status: {
        type: String,
        required: false,
        default: null
    },
    payment_id: {
        type: String,
        required: false,
        default: null
    },
    date: {
        type: Date,
        default: moment()
    }
});

module.exports = PassBook = mongoose.model('passbook', PassBookSchema);
