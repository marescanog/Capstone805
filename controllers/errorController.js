const AppError = require('./../apiUtils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = () => new AppError('Invalid Token. Please login again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again!', 401);

const handleJWTError = err => {
    const message = `Invalid input data.`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) =>{
    if(err.statusCode === 401){
        // TODO later
        return res.status(err.statusCode).render("pages/public/accessRestricted",{layout:"main"});
    }

    if(err.statusCode === 403){
        // TODO later
        return res.status(err.statusCode).render("pages/public/accessdenied",{layout:"main"});
    }

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });
}

const sendErrorProd = (err, res) =>{
    // Only send operational messages to the client
    if(err.isOperational){
        
        if(err.statusCode === 401){
            // TODO later
            return res.status(err.statusCode).render("pages/public/accessrestricted",{layout:"main"});
        }
        
        if(err.statusCode === 403){
            // TODO later
            return res.status(err.statusCode).render("pages/public/accessdenied",{layout:"main"});
        }

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            statusCode: err.statusCode
        });

    // Programming errors and other unknown: don't leak error details
    } else {
        // 1) Log Error -> will be logged on cyclic
        console.error('ERROR 💥', err);

        // 2.) Send generic messahe
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
            statusCode: err.statusCode
        });
    }
}

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else {
        let error = {...err}
        if(error.name === "CastError") error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTError()
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError()
        sendErrorProd(error, res);
    }
}