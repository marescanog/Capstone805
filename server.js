const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HTTP_PORT = process.env.PORT || 8081;

process.on('uncaughtException', err =>{
    console.log('💥 UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config.env'});


const app = require('./app');

const DB = process.env.NODE_ENV === 'production' ? 
    (process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).replace('<USERNAME>', process.env.DATABASE_USERNAME)
    : process.env.DATABASE_LOCAL;

mongoose.connect(DB, {})
.then(() => { 
    console.log(`Database connected successfully! Connected to: ${process.env.NODE_ENV} DB server`);
    // setup http server to listen on HTTP_PORT
    const server = app.listen(HTTP_PORT, onHttpStart);
})
.catch(() => { 
    console.log('Database connection failed!');
    const server = app.listen(HTTP_PORT, onHttpStart);
})

function onHttpStart() {
    console.log(`Express http server listening on: ${HTTP_PORT}`);
}

process.on('unhandledRejection', err => {
    console.log('💥 UHANDLED REJECTION!');
    console.log(err.name, err.message);
});



