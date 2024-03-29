class AppError extends Error {
    constructor(message, statusCode, sendJSON = false){
        super(message);
        this.errMessage = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.sendJSON = sendJSON;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;