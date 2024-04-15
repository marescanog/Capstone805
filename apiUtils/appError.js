class AppError extends Error {
    constructor(message, statusCode, sendJSON = false, isOperational = true){
        super(message);
        this.errMessage = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        this.sendJSON = sendJSON;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;