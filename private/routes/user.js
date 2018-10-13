/**
 * This route handles all user account related actions from the client
 * Any action involving registration, login and updating records will use routes from this file
 */

const database = require('../database.js');
const encryptor = require('../encryptor');
const bodyParser = require('body-parser');

// create parser to strip out submitted fields from 'application/x-www-form-urlencoded' web forms
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// Receive a login attempt from the user
let login = function (req, res) {
    res.locals.email = req.body.email;
    res.locals.password = req.body.password;

    var statement = "SELECT password_hash, password_salt FROM Users WHERE email = ?";
    database.select(statement, email, verifyLogin.bind(this, req, res));
};

// Receive results from the database to see if they match the user attempting to log-in
let verifyLogin = function (req, res, hash, salt) {
    console.log("received verify login attempt for", res.locals.email);
    
    // If the database returned no result for this user, no need to check the password
    if (!hash || !salt) {
        loginResult(false);
        return;
    }
    encryptor.checkPasswordsMatch(res.locals.password, hash, salt, loginResult.bind(this, req, res));
};

// The password check will pass the result to this function once checking has completed
let loginResult = function (successful){
    if (successful) {
        console.log("login successful");
    } else {
        console.log("login failure");
    }
    
    console.log("running next");
    next(successful);
}

module.exports = {
    login: login,
};