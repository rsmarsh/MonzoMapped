// server logic is external to allow easier switching to use a different server at a later date
const server = require('./private/server/express-server');
const routes = require('./private/routes/router')(server.instance);
const authoriser = require('./private/authoriser');
const db = require('./private/database');

server.start(8080);