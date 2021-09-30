const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cron = require("node-cron");
const users = require('./routes/api/users');
const stocks = require('./routes/api/stocks');
const dashboard = require('./routes/api/dashboard');
// const transactions = require('./routes/api/transactions');
const trycheckUserTransactions =  require('./utils/transactionsCron')
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
// app.use('/api/transactions', dashboard);

const port = process.env.PORT || 5000;
// Creating a cron job which runs on every 10 second
// cron.schedule("*/100 * * * * *", function() {
//   // trycheckUserTransactions();
//   // updateStocksLivePrice()
//   // console.log("running a task every 20 second");
// });

app.listen(port, () => console.log(`Server running on port ${port}`));
