const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
const HTTP_PORT = process.env.PORT || 8080;

dotenv.config({path: './config.env'});

// const DB = process.env.NODE_ENV === 'development' ? 
//         process.env.DATABASE_LOCAL
//     : (process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).replace('<USERNAME>', process.env.DATABASE_USERNAME);

// mongoose.connect(DB, {})
// .then(() => { console.log('Database connected successfully!');})
// .catch(() => { console.log('Database connection failed!');})

function onHttpStart() {
    console.log(`Express http server listening on: ${HTTP_PORT}`);
}


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);