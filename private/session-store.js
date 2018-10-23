const dbAuth = require('./credentials/database');
const MySQLStore = require('express-mysql-session');

let options = {
    host: dbAuth.hostname,
    // port: 3306,
    user: dbAuth.username,
    password: dbAuth.password,
    database: dbAuth.databaseName
};


module.exports = function(session) {
    return new MySQLStore(options);
}