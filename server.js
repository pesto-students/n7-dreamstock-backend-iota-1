const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cron = require("node-cron");
const users = require('./routes/api/users');
const stocks = require('./routes/api/stocks');
const dashboard = require('./routes/api/dashboard');
const passbook = require('./routes/api/passbook');
const wallet = require('./routes/api/wallet');
const  moment = require('moment-timezone');
// const transactions = require('./routes/api/transactions');
const trycheckUserTransactions =  require('./utils/transactionsCron')
const timezonecheck =  require('./utils/timezonecheck')
const app = express();
const request = require('request')
const updateStocksLivePrice = require('./utils/cron')
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/stocks', stocks);
app.use('/api/dashboard', dashboard);
app.use('/api/passbook', passbook);
app.use('/api/wallet', wallet);
// app.use('/api/transactions', dashboard);

const port = process.env.PORT || 5000;
// Creating a cron job which runs on every 10 second
cron.schedule("*/10 * * * * *", function() {
  // trycheckUserTransactions();
  // updateStocksLivePrice()
  // console.log("running a task every 20 second");
  // timezonecheck()
});

app.listen(port, () => {
  moment.tz.setDefault("Asia/Mumbai");
  console.log(`Server running on port ${port}`)
});
