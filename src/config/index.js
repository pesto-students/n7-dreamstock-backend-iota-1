const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  stockApieEndPoint: process.env.API_URL,
  stockApiKey: process.env.STOCK_API_KEY,
  port: process.env.SERVER_PORT,
  mongoUrl: process.env.MONGO_URL,
  secredtJWT :process.env.SECRET_JWT,
  isDemoENV:process.env.IS_DEMO_ENV
};

