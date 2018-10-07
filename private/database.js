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

// Receive a login attempt from the user
let loginAttempt = function (username, password) {
    console.log("received loginAttempt");
    let statement = "SELECT hash, salt FROM Users WHERE username = ";
    selectStatement(statement, username, verifyLogin);
};

// Receive results from the database to see if they match the user attempting to log-in
verifyLogin = function (error, results, fields) {
    console.log("received verify login attempt");
};

// Takes a statement containing '?' escape characters, which are switched out by an array of inserts
// Finally, the callback will be triggered upon completion of the query
let selectStatement = function (statement, inserts, callback) {
    let db = connectToDB();

    db.query(statement, inserts, function (error, results, fields) {
        if (error) throw error;
        console.log('DB response is:');
        console.log(results);
        callback(fields);
    });

    // Does this need to be within the callback function?
    closeDBConnection(db);
}

// Debug function for testing functionality
let testing = function(){
    encryptor.encryptPassword('test', console.log);
}

module.exports = {
    select: selectStatement,
    testing: testing
};