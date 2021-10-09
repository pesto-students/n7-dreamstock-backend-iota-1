const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StocksOrderedSchema = new Schema({
  stock_name: {
    type: String,
    required: true,
  },
  stock_symbol: {
    type: String,
    required: true,
  },
  open: {
    type: Number,
    required: true,
  },
  close: {
    type: Number,
    required: false,
    default: null,
  },
  current: {
    type: Number,
    required: false,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = StocksOrdered = mongoose.model('StocksOrdered', StocksOrderedSchema);
