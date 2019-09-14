require('dotenv').config();
let mysql = require('mysql');

let con = mysql.createPool({
    connectionLimit : 5,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = con;