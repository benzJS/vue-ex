require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const mysql = require('mysql');


const PORT = process.env.PORT || 3000;
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: process.env.SQL_USER,
//     password: process.env.SQL_PASSWORD,
//     database: 'vue-ex'
// });
// db.connect();

const authMiddleware = require('./middlewares/auth.middleware');

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/users', authMiddleware.checkToken, userRoute);
app.use('/auth', authRoute);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
