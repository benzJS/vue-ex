require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const PORT = process.env.PORT || 3000;
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'vue-ex'
});
db.connect();

const userRoute = require('./routes/user.route');

app.use('/users', userRoute);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports.db = db;