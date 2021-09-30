const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const singleOrderSchema = require('./order')
// Create Schema
const Transactions = new Schema({
    user_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    gross_investment :{
        type: String,
        required: true,
    },
    gross_return:{
        type: String,
        required: true,
    },
    order_details:[{ _id: Schema.Types.ObjectId, ref: singleOrderSchema }]
});

module.exports = Transactions = mongoose.model('Transactions', Transactions);
{date:{$gt: ISODate('2021-09-25')}}