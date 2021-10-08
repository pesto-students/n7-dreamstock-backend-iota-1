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
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    order_price: {
        type: String,
        required: true,
    },
    close_price: {
        type: String,
        required: false,
        default: null
    },
    change: {
        type: String,
        required: false,
        default: null
    },
    profit_loss: {
        type: String,
        required: false,
        default: null
    },
    current_price: {
        type: String,
        required: false,
        default: null
    },
    earnings: {
        type: String,
        required: false,
        default: null
    },
    order_closed: {
        type: Boolean,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: new Date().toISOString()
    }
});

module.exports = SingleOrder = mongoose.model('SingleOrder', singleOrderSchema);
