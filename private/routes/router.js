const user = require('./user');
const db = require('../database');

// doesn't seem like this belongs in this file, but this works with the current setup as routes need to point to it
const authoriser = require('../authoriser');

let visitorCounter = 0;

let logVisitor = function(req,res,next) {
    console.log("Visitor number", ++visitorCounter);
    next();
};

//pass in the server instance when requiring this file, so these functions can access the server
module.exports = function(server) {

    server.use('/', function(req, res, next){
        if (req.session.views) {
            req.session.views++;
        } else {
            req.session.views = 1;
            console.log("new session created");
        }

        // if a user is not logged in, always forward them to the login page
        if (req.url!=='/login' && !req.session.authenticated) {
            res.redirect('/login');
        } else {
            next();
        }
    });

    // only server static files within the public folder or lower
    server.get('/', logVisitor,  server.inner.static(__dirname + '/public'))

    // Receive a login or registration request from the client
    server.post('/login', server.bodyParser, user.login);
    server.post('/register', server.bodyParser, user.register);
    server.get('/logout', user.logout, function(req, res){
        res.send('Successfully logged out');
    });

    // used for testing, to be removed before a final version is made
    server.get('/testing', function(req, res){
        db.testing();
        res.type('html');
        res.send(`
            <h1>Test Ran</h1>
        `);
    });

    // Send the login form to the client
    server.get('/login',  function(req, res){
        res.type('html');
        res.send(`
        <h1>Hello, enter your details below to login</h1>
        <form action="/login" method="post">
        <input type="text" name="email" placeholder="email" />
        <input type="password" name="password" />
        <button>Sign in</button>
        </form>
        `);
        
    });

    // Send the login form to the client
    server.get('/register',  function(req, res){
        res.type('html');
        res.send(`
        <h1>Hello, Enter your details below to register an account</h1>
        <form action="/register" method="post">
        Email: <input type="text" name="email" placeholder="email" />
        Password: <input type="password" name="password" />
        <button>Register</button>
        </form>
        `);
        
    });

    server.get('/monzo', authoriser.connectMonzo);

    server.get('/oauth/redirect', authoriser.getAccessToken);

    server.get('/monzo/account', function(req, res){
        res.type('html');
        res.send(`
            <h1>Log In Attempt</h1>
        `);
    });

    // Test route to run commands on the database and write the response to the page
    server.get('/db', function(req, res){
        var callback = function(dbData){
            res.type('html');
            res.send(`
            <h1>DB Response:</h1>
            <p>`+dbData+`</p>
            `);
        };
        db.query('SELECT ? from MonzoMappedDB.?', ['*', 'Users'], callback);
    });

};