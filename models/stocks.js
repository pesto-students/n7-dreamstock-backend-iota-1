const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StocksOrderedSchema = new Schema({
    stock_name: {
        type: String,
        required: true
    },
    stock_symbol: {
        type: String,
        required: true
    },
    open: {
        type: String,
        required: true,
    },
    close: {
        type: String,
        required: false,
        default: null
    },
    current: {
        type: String,
        required: false,
        default: null
    },
    date: {
        type: Date,
        default: new Date().toISOString()
    }
});

module.exports = StocksOrdered = mongoose.model('StocksOrdered', StocksOrderedSchema);
