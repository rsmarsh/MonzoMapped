/**
 * This route handles all user account related actions from the client
 * Any action involving registration, login and updating records will use routes from this file
 */

const database = require('../database.js');
const encryptor = require('../encryptor');

//////LOGIN HANDLING//////////
// Receive a login attempt from the user
let login = function (req, res) {
    res.locals.email = req.body.email;
    res.locals.password = req.body.password;


    let statement = "SELECT password_hash FROM Users WHERE email = ?";
    database.query(statement, res.locals.email, function(results){
        // Callback will be invoked along with the results from the database

        // If no user was found for this email address, inform the user of the failure
        if (results.length === 0) {
            res.send("no existing user found for this email");
            return;
        }

        // check that the password entered by the user matches the held password
        encryptor.checkPasswordsMatch(res.locals.password, results[0].password_hash, function(passwordsMatch){
            console.log("passwords match:",passwordsMatch);
            if (passwordsMatch); {
                req.session.authenticated = true;
            }
            res.send(passwordsMatch);
        });

    });
};

let logout = function(req, res) {
    req.session.authenticated = false;
    console.log("user logged out");
    res.redirect('/');
};


//////REGISTRATION HANDLING///////

// Register a new user in the database, 
let register = function(req, res){
    res.locals.email = req.body.email;
    res.locals.password = req.body.password;

    //first check that this email address does not already exist within the database
    let statement = "SELECT email FROM Users WHERE email = ?";
    database.query(statement, res.locals.email, function(results){
        
        if (results.length > 0) {
            registrationResult(req, res, {
                success: false,
                message: "This email is already in use by another account."
            });
            return;
        }

        // Email isn't already registered, good to go ahead with the DB insert statement
        createNewUser(req, res);

    });

};

// Passed the checks, it is safe to go ahead and insert the new user into the database
let createNewUser = function(req, res) {

    // Hash and salt the plaintext password using bcrypt before inserting it
    encryptor.encryptPassword(res.locals.password, function(hash){

        let statement = "INSERT INTO users (email, password_hash, created_date) VALUES (?, ?, NOW())";
        let inserts = [res.locals.email, hash];

        database.query(statement, inserts, function(successful){

            // A message which will be displayed to the user once the process has completed
            let displayMessage = successful ?  
                "Registration complete, you may now log-in to your new account!" :
                "Sorry, your registration was unsuccessful.";

            registrationResult(req, res, {
                success: successful,
                message: displayMessage
            });
        });
    });
}

// The result object contains a "success" boolean, and a "message" string with a error reasoning or success message
let registrationResult = function(req, res, resultObject) {
    console.log("registration complete for user", res.locals.email);
    res.send(resultObject.message);
};

module.exports = {
    login: login,
    logout: logout,
    register: register
};