const mysql = require('mysql');
const dbAuth = require('./credentials/database');

let connectToDB = function(){
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

let closeDBConnection = function(connection){
    connection.end();
    console.log("Database Connection Ended");
}

let runStatement = function(statement, callback) {
    let db = connectToDB();
    db.query('SELECT * FROM '+dbAuth.databaseName+'.Users', function (error, results, fields) {
        if (error) throw error;
        console.log('DB response is:')
        console.log(results);
        callback(fields);
    });
    closeDBConnection(db);
}



module.exports = {
    runStatement: runStatement
};