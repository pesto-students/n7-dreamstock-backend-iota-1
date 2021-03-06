const http = require('http');
const moment = require('moment-timezone');
const app = require('./app');
const config = require('./config');
const client = require('prom-client');
const register = new client.Registry();

const server = http.createServer(app);

server.listen(config.port, () => {
  moment.tz.setDefault('UTC');
  console.log(`Server running on port ${config.port}`);
});

register.setDefaultLabels({
  app: 'dreamstock-app'
})

