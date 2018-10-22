// server logic is external to allow easier switching to use a different server at a later date
const server = require('./private/server/express-server');

// Set up session storing middleware
const session = require('express-session');

const uuid = require('uuid/v4');

// Add session creation to be the first middleware to get user info as early as possible
server.instance.use(session({
    // generate a uuid and use it as the session ID
    genid: function(req) {
        return uuid();
    },
    // for now, during development, generate a new session secret each time the app is launched
    secret: 'verysecretsecret',
    cookie: {},
    resave: false,
    saveUninitialized: true
}));

// Set up routes on the server
const routes = require('./private/routes/router')(server.instance);
const authoriser = require('./private/authoriser');
const db = require('./private/database');

server.start(8080);