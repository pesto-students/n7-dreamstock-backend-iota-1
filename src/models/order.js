const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const singleOrderSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    stock_name: {
        type: String,
        required: true
    },
    stock_symbol: {
        type: String,
        required: true
    },
    investment: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    order_price: {
        type: Number,
        required: true,
    },
    close_price: {
        type: Number,
        required: false,
        default: null
    },
    change: {
        type: Number,
        required: false,
        default: null
    },
    profit_loss: {
        type: String,
        required: false,
        default: null
    },
    current_price: {
        type: Number,
        required: false,
        default: null
    },
    earnings: {
        type: Number,
        required: false,
        default: null
    },
    order_closed: {
        type: Number,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = SingleOrder = mongoose.model('SingleOrder', singleOrderSchema);
