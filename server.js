const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
const HTTP_PORT = process.env.PORT || 8081;

dotenv.config({path: './config.env'});

const DB = process.env.NODE_ENV === 'production' ? 
    (process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).replace('<USERNAME>', process.env.DATABASE_USERNAME)
    : process.env.DATABASE_LOCAL;

mongoose.connect(DB, {})
.then(() => { console.log(`Database connected successfully! Connected to: ${process.env.NODE_ENV} DB server`);})
.catch(() => { console.log('Database connection failed!');})

function onHttpStart() {
    console.log(`Express http server listening on: ${HTTP_PORT}`);
}


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);