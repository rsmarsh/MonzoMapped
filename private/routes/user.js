/**
 * This route handles all user account related actions from the client
 * Any action involving registration, login and updating records will use routes from this file
 */

const db = require('../database.js');
const encryptor = require('../encryptor');

//////LOGIN HANDLING//////////
// Receive a login attempt from the user
let login = function (req, res) {
    // Don't store within the session variables until this is verified as correct login info
    res.locals.email = req.body.email;
    res.locals.password = req.body.password;


    let statement = "SELECT password_hash FROM Users WHERE email = "+db.escape(res.locals.email);
    db.query(statement, res.locals.email, function(err, results){
        // This callback will be invoked along with the results from the database

        // If no user was found for this email address, inform the user of the failure
        if (results.length === 0) {
            res.send("no existing user found for this email");
            return;
        }

        // check that the password entered by the user matches the held password
        encryptor.checkPasswordsMatch(res.locals.password, results[0].password_hash, function(passwordsMatch){
            verifyUser(req, res, passwordsMatch);
        });

    });
};

// Confirm that a provided password matches the stored password
let verifyUser = function(req, res, passwordsMatch) {
    if (!passwordsMatch) {
        res.send('Invalid user. Please try again');
        return;
    }
    
    // It was a match, continue with the login process
    req.session.authenticated = true;
    req.session.email = res.locals.email;
    

    // Do an inner join statement, to find out if this account has a Monzo account linked to their login
    // There will only be a result if this user's ID appears once in both tables
    let statement = `
        SELECT Users.user_id, MonzoLink.account_id 
        FROM Users
        INNER JOIN MonzoLink ON Users.user_id = MonzoLink.user_id
        WHERE email = `+db.escape(req.session.email)+`;
    `;

    db.query(statement, null, function(err, results){
        if (results.length === 1) {
            console.log(results);
            repopulateSession(req, res, results[0]);
        } else {
            res.redirect('/monzo');
        }
    });
    
    
};

// fill in the user session with their account IDs
let repopulateSession = function(req, res, results){
    req.session.monzo = results.user_id;
    res.redirect('/map');
}

// Log out and deauthenticate a user session
let logout = function(req, res, next) {
    if (req.session.authenticated) {
        req.session.authenticated = false;
        delete req.session.monzo;
        delete req.session.email;
        next();
        return;
    } 
    // if a user somehow ends up here when not logged in, just send them back to home
    res.redirect('/');
};


//////REGISTRATION HANDLING///////
// Register a new user in the database, 
let register = function(req, res){
    res.locals.email = req.body.email;
    res.locals.password = req.body.password;

    //first check that this email address does not already exist within the database
    let statement = "SELECT email FROM Users WHERE email = ?";
    db.query(statement, res.locals.email, function(err, results){
        
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

        db.query(statement, inserts, function(err, successful){

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