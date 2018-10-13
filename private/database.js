const encryptor = require('./encryptor');
const mysql = require('mysql');
const dbAuth = require('./credentials/database');

// Internal function, opens up a connection to the database
let connectToDB = function () {
    let connection = mysql.createConnection({
        host: dbAuth.hostname,
        user: dbAuth.username,
        password: dbAuth.password,
        database: dbAuth.databaseName
    });
    connection.connect();
    console.log("Database Connection Opened");
    return connection;
};

// Once the query is complete, close the database connection to free up the available connections
let closeDBConnection = function (connection) {
    connection.end();
    console.log("Database Connection Closed");
};

// Takes a statement containing '?' escape characters, which are switched out by an array of inserts
// Finally, the callback will be triggered upon completion of the query
let select = function (statement, inserts, callback) {
    let db = connectToDB();

    db.query(statement, inserts, function (error, results, fields) {
        let hash, salt;
        if (error) throw error;
        if (results.length === 0) {
            console.log("no existing user found for this email");
        } else {
            hash = results[0].password_hash;
            salt = results[0].password_salt;
        }

        if (results.length > 1) {
            console.warn('WARNING: more than two results returned for one email address, using the first one')
        }

        callback(hash, salt);
    });

    // Does this need to be within the callback function? What if the query hasn't finished yet?
    closeDBConnection(db);
}

// Debug function for testing functionality
let testing = function(){
    encryptor.encryptPassword('test', console.log);
}

module.exports = {
    select: select,
    loginAttempt: loginAttempt,
    testing: testing
};