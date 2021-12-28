const mysql = require('mysql');
require('dotenv').config();

let password = process.env.DBPASSWORD;
let database = process.env.DBNAME;
let user = process.env.DBUSER;
let host = process.env.DBHOST;

// mysql connection
var db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
});

db.connect(function (err) {
    if (!err) { console.log("Connected"); } else {
        console.log(err);
        console.log('Connection  Failed');
    }
});

module.exports = db;