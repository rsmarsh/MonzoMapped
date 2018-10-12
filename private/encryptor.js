let bcrypt = require('bcrypt-nodejs');

/** 
 * Pass plaintext passwords into this function
 * The function will run the password through bcrypt and return an encrypted password
**/
let encryptPassword = function(plainTextPassword, callback) {
    
    bcrypt.hash(plainTextPassword, null, null, function(err, hash){

        // Callback to a function which inserts the hash into the database
        callback(hash);
    });
}

let checkPasswordsMatch = function(plainTextPassword, hash, callback) {
    
    // Check provided password and stored hash are a match
    bcrypt.compare(plainTextPassword, hash, function(err, passwordsMatch){
        if (err) {
            throw err;
        }

        // compare returns a boolean of whether the passwords match
        callback(passwordsMatch);   
    });

}


module.exports = {
    encryptPassword: encryptPassword,
    checkPasswordsMatch: checkPasswordsMatch,
};