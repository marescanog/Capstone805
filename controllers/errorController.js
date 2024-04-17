const AppError = require('./../apiUtils/appError');
const ViewBuilder = require('./../apiUtils/viewBuilder');

const render401Page = (err, req, res) => {
        // TODO later
        const VB = new ViewBuilder({
            alertToLogin: false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("title", '401: Restricted');
        VB.addOptions("css", 'errorPage.css');
        VB.addOptions("headerTitle", '401: You are not logged in!');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ]);
        return res.status(err.statusCode).render("pages/public/accessRestricted",VB.getOptions());
}

const render403Page = (err, req, res) => {
    // TODO later
    const VB = new ViewBuilder({
        alertToLogin: false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("title", '403: Denied');
    VB.addOptions("css", 'errorPage.css');
    VB.addOptions("headerTitle", '403: You do not have access to this resource!');
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ]);
    return res.status(err.statusCode).render("pages/public/accessdenied",VB.getOptions());
}

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

const sendErrorDev = (err, req, res) =>{

    if(err?.statusCode === 400){
        return res.status(err?.statusCode).json({
            status: err?.status,
            statusCode: err?.statusCode,
            error: err,
            message: "Please check the fields",
            jsonData: err?.message
        });
    }

    if(err?.statusCode === 401){
        return render401Page(err, req, res);
    }

    if(err?.message === "jwt expired"){
        return render401Page(err, req, res);
    }

    if(err?.statusCode === 403){
        return render403Page(err, req, res);
    }

    res.status(err?.statusCode).json({
        status: err?.status,
        error: err,
        message: err?.message,
        stack: err?.stack,
        statusCode: err?.statusCode
    });
}

const sendErrorProd = (err, req, res) =>{

    // Only send operational messages to the client
    if(err.isOperational){
 
        if(err.sendJSON == true){
            return res.status(err?.statusCode).json({
                status: err?.status,
                message: err?.message??err?.errMessage,
                statusCode: err?.statusCode
            });
        }

        if(err?.statusCode === 400){
            return res.status(err?.statusCode).json({
                status: err?.status,
                error: err,
                message: JSON.stringify(err?.message),
                json: err?.message
            });
        }

        if(err?.statusCode === 401){
            return render401Page(err, req, res);
        }
    
        if(err?.statusCode === 403){
            return render403Page(err, req, res);
        }

        res.status(err?.statusCode).json({
            status: err?.status,
            message: err?.message??err.errMessage,
            statusCode: err?.statusCode
        });

    // Programming errors and other unknown: don't leak error details
    } else {
        // 1) Log Error -> will be logged on cyclic
        console.error('ERROR 💥', err);

        // 2.) Send generic messahe
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
            statusCode: err?.statusCode
        });
    }
}

module.exports = (err, req, res, next)=>{
    err.statusCode = err?.statusCode || 500;
    err.status = err?.status || 'error';
    let error = {...err};
    error.message = err?.message;

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(error, req, res);
    } else {
        if(error.name === "CastError") error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTError()
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError()
        sendErrorProd(error,req, res);
    }
}