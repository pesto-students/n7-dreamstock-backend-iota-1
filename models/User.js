const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile_number: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  in_progress_orders: {
    type: String,
    required: false
  },
  order_history: {
    type: String,
    required: false
  },
  passbook_id: {
    type: String,
    required: false
  },
  wallet_balance: {
    type: String,
    required: false,
    default: '100'
  },
  currency: {
    type: String,
    required: false,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users', UserSchema);
