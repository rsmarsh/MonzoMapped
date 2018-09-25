const express = require('express');
const app = express();
const port = 3001;
let visitorCounter = 0;

let logVisitor = function(req,res,next) {
    console.log("Visitor number " + ++visitorCounter);
    next();
};

// only server static files within the public folder or lower
app.use('/', logVisitor,  express.static(__dirname + '/public'))


app.listen(port);