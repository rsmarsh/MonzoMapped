const authoriser = require('./private/authoriser');
const db = require('./private/database');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

let visitorCounter = 0;

let logVisitor = function(req,res,next) {
    console.log("Visitor number " + ++visitorCounter);
    next();
};

// only server static files within the public folder or lower
app.get('/', logVisitor,  express.static(__dirname + '/public'))

app.get('/monzo', authoriser.connectMonzo);

app.get('/oauth/redirect', authoriser.getAccessToken);

app.get('/monzo/account', function(req, res){
    res.type('html');
    res.send(`
        <h1>Log In Attempt</h1>
    `);
});

// Send the login form to the client
app.get('/login', function(req, res){
    res.type('html');
    res.send(`
        <h1>Hello</h1>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" />
            <button>Sign in</button>
        </form>
    `);

});

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Receive a login request from the client
app.post('/login', urlencodedParser, function(req, res){
    
    console.log("received post request for user", username);
    var username = req.body.username;
    var password = req.body.password;
    db.loginAttempt(username, password);
    
})

app.get('/testing', function(req, res){
    db.testing();
    res.type('html');
    res.send(`
        <h1>Test Ran</h1>
    `);
});

// test route to run commands on the database and write the response to the page
app.get('/db', function(req, res){
    var callback = function(dbData){
        res.type('html');
        res.send(`
        <h1>DB Response:</h1>
        <p>`+dbData+`</p>
        `);
    };
    db.select('SELECT ? from MonzoMappedDB.?', ['*', 'Users'], callback);
});

app.listen(port);

console.log("server listening on localhost:"+port);