const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cron = require('node-cron');
const cors = require('cors');
const app = express();
const moment = require('moment');
const apiMetrics = require('prometheus-api-metrics');

// routes
const users = require('./api-routes/users');
const stocks = require('./api-routes/stocks');
const dashboard = require('./api-routes/dashboard');
const passbook = require('./api-routes/passbook');
const wallet = require('./api-routes/wallet');
const profile = require('./api-routes/profile');


const trycheckUserTransactions = require('./utils/transactionsCron');
const timezonecheck = require('./utils/timezonecheck');
const request = require('request');
const updateStocksLivePrice = require('./utils/cron');

// DB Config
const db = require('./config').mongoURI;


// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// CORS compatible
const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Using prometheus to collect api data
app.use(apiMetrics());

// Passport middleware
app.use(passport.initialize());


// Passport Config
require('./utils/passport')(passport);


// Use Routes
app.use('/api/users', users);
app.use('/api/stocks', stocks);
app.use('/api/dashboard', dashboard);
app.use('/api/passbook', passbook);
app.use('/api/wallet', wallet);
app.use('/api/profile', profile);


// Creating a cron job which runs on every 10 second
cron.schedule('*/10 * * * * *', function() {
  // const d= moment().add({hours:5,minutes:30})
  // console.log('time',d)
  // trycheckUserTransactions();
  updateStocksLivePrice();
  //   console.log("running a task every 10 second");
  // timezonecheck()

});

module.exports = app;
