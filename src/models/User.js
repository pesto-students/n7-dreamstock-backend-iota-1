const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserDefaults = require('../config/constants').userDefaults
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
  google_id:{
    type:String,
    required:false
  },
  imageUrl :{
    type:String,
    required:false,
    default:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  },
  wallet_balance: {
    type: Number,
    required: false,
    default: '10000'
  },
  currency: {
    type: String,
    required: false,
    default: 'INR'
  },
  mobile_number: {
    type: String,
    required: false,
    default: UserDefaults.mobile_number
  },
  card_number: {
    type: String,
    required: false,
    default: UserDefaults.card_number
  },
  account_name: {
    type: String,
    required: false,
    default: UserDefaults.account_name
  },
  expiry_date: {
    type: String,
    required: false,
    default: UserDefaults.expiry_date
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model('users', UserSchema);
