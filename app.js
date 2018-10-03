const authoriser = require('./private/authoriser');
const db = require('./private/database');
const express = require('express');
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
        <h1>Log In Success</h1>
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
    db.runStatement('SELECT * from Users', callback);
});

app.listen(port);

console.log("server listening on localhost:"+port);