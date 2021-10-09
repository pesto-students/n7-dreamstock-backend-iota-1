const dotenv = require('dotenv');
dotenv.config();
// module.exports = {
//   stockApieEndPoint: process.env.API_URL,
//   stockApiKey: process.env.STOCK_API_KEY,
//   port: process.env.SERVER_PORT,
//   mongoUrl: process.env.MONGO_URL,
//   secredtJWT :process.env.SECRET_JWT,
//   isDemoENV:process.env.IS_DEMO_ENV
// };

module.exports = {
  stockApieEndPoint: 'https://finnhub.io/api/v1/',
  stockApiKey: 'c4rs38iad3ic8b7csbtg',
  port: 5000,
  mongoURI: 'mongodb+srv://new-user1:KsXJ2rZyWjrB9Wr9@cluster0.bdyyh.mongodb.net/DreamStock?retryWrites=true&w=majority',
  secredtJWT: 'secret',
  isDemoENV: true,
};
