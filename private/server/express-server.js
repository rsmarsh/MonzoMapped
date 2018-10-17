const express = require('express');
const server = express();
const bodyParser = require('body-parser');

server.inner = express;

// attach the body-parser to the server
// creates a parser to strip out submitted fields from 'application/x-www-form-urlencoded' web forms
server.bodyParser = bodyParser.urlencoded({ extended: false })

// Start the server and listen for requests
let startServer = function(port) {
    server.listen(port);
    console.log("express server listening on port", port);
};

module.exports = {
    instance: server,
    start: startServer
};