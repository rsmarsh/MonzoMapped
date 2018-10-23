// server logic is external to allow easier switching to use a different server at a later date
const server = require('./private/server/express-server');
const uuid = require('uuid/v4');
// Set up session storing middleware
const session = require('express-session');
const sessionStore = require('./private/session-store')(session);

// Add session creation to be the first middleware to get user info as early as possible
server.instance.use(session({
    // generate a uuid and use it as the session ID
    genid: function(req) {
        return uuid();
    },
    // for now, during development, generate a new session secret each time the app is launched
    key: 'app.MonzoMapped',
    secret: 'verysecretsecret',
    store: sessionStore,
    cookie: {
        maxAge: 604800 //seconds for now, this prevents the cookie being deleted on events such as closing the browser
    },
    resave: false,
    saveUninitialized: true
}));

// Set up routes on the server
const routes = require('./private/routes/router')(server.instance);
const authoriser = require('./private/authoriser');
const db = require('./private/database');

server.start(8080);