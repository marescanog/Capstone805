const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Guest = require('../models/guestModel.js');
const Employee = require('../models/employeeModel.js');
const catchAsync = require('./../apiUtils/catchAsync');
const AppError = require('../apiUtils/appError.js');
const crypto = require ('crypto');
const bcrypt = require('bcryptjs');
const Email = require('./../apiUtils/email')

const {Types} = mongoose;

exports.registerUserAccount = catchAsync(async (req, res, next) => {
    // TODO add 1 second delay just like in login
   
    const {
        firstName, lastName, emailAddress, password, passwordConfirm,
        address, city, postalCode, country, mobileNumber
    } = req.body;

    let found;

    // this flag is so users cant access the verify account page, especially if they havent created an account
    req.session.createdAccount = emailAddress;

    // Check if email exists
    if(emailAddress != null && emailAddress != ""){
        // TODO add try catch
        found = await Guest.findOne({emailAddress: emailAddress});
    }
    // console.log(`Expiry ${req.session.resendLinkexpiry}`)
    // console.log(`Date now ${Date.now()}`)
    // console.log(`is expiry less than now ${req.session.resendLinkexpiry < Date.now()}`)
    if(found){
        let emailsent = false;

        // CASE A: Existing Deactivated user
        //Send email account is not active and to contact admin
        if(!emailsent && !found.isActive){
            const contactURL = `${req.protocol}://${req.get('host')}/contactUs`;
            // Only send email if session indicates expiry link expired or has not been created
            // refactor: instead of storimg in session, store in db & delete activation code?
            if(!req.session.resendLinkexpiry || req.session.resendLinkexpiry < Date.now()){
                req.session.resendLinkexpiry = Date.now() + (5 * 60 * 1000);
                await (new Email(found, contactURL)).sendContactAdmin();
            } 
            emailsent = true;
        }

        // CASE B: Existing Not Validated User
        // Send validation email again
        if(!emailsent && !found.isVerified){

            // check expiry time for validation before sending new email
            if(found.activationResendExpires && found.activationResendExpires instanceof Date && found.activationResendExpires.getTime() <  Date.now()){
                // Generate new activation link & send to their email

                let foundActivationToken = await found.createActivationToken();

                await found.save({validateBeforeSave: false});

                const activationURL = `${req.protocol}://${req.get('host')}/api/v1/guests/activate/${foundActivationToken}`;

                req.session.resendLinkexpiry = found.activationResendExpires;

                await (new Email(found, activationURL, {activationCode:found.activationCode, contactURL:`${req.protocol}://${req.get('host')}/contactUs`})).resendActivationLink();

            } else {

                if(!(found.activationResendExpires instanceof Date)){
                    delete req.session.createdAccount;
                    delete req.session.resendLinkexpiry;
                    return next(new AppError("Something went wrong", 500));
                }

            }
            emailsent = true;
        }

        // CASE C: Existing Validated user
        //Send emai acc already registered
        if(!emailsent && found.isVerified){
            const activationURL = `${req.protocol}://${req.get('host')}`;
            // Only send email if session indicates expiry link expired or has not been created
            if(!req.session.resendLinkexpiry || req.session.resendLinkexpiry < Date.now()){
                req.session.resendLinkexpiry = Date.now() + (5 * 60 * 1000);
                await (new Email(found, activationURL)).sendEmailRegisterExistingAccount();
            } 
            emailsent = true;
        }

        // If Validated -> Send Login Link & Forgot Password Link
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Activation link sent to email'
        })
    } 

    // Default Case No acc created yet
    // Start a session.
    const session = await mongoose.startSession();
    let activationToken; 
    let newUser;
    try {

        // Start a transaction.
        session.startTransaction();

        // Create User - IsActive yes, Verified no
        newUser = await Guest.create({
            emailAddress: emailAddress,
            password: password,
            passwordConfirm: passwordConfirm,
            firstName: firstName,
            lastName: lastName,
            isVerified: false,
            isActive: true,
            createdOn: new Date(),
            address: {
                address: address,
                city: city,
                postalCode: postalCode,
                country: country
            },
            reservations: [],
            formSubmissions: [],
            loyaltyHistory: []
        });

        activationToken = await newUser.createActivationToken();
        await newUser.save({validateBeforeSave: false});

        req.session.resendLinkexpiry = newUser.activationResendExpires;

        if(activationToken == null && newUser == null){
            // Rollback 
            await session.abortTransaction();
            return next(new AppError("Token or User was not created",500));
        }

        await session.commitTransaction();
        console.log('Register User Transaction Committed.');

    } catch (err) {
        delete req.session.createdAccount;
        delete req.session.resendLinkexpiry;

        if(err._message === "guest validation failed"){
            return next(new AppError(JSON.stringify(err.errors),400));
        }

        // If any operation fails, abort the transaction.
        // Rollback 
        await session.abortTransaction();
        console.log('Transaction aborted due to an error:', err);

        return next(new AppError("Something went wrong",500));
    } finally {
        // End the session.
        session.endSession();
    }

    // Email Activation Link and Acitivation Code
    try {
        // 3) Send it to users email
        const activationURL = `${req.protocol}://${req.get('host')}/api/v1/guests/activate/${activationToken}`;

        await (new Email(newUser, activationURL, {activationCode:newUser.activationCode})).sendActivationLink();

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Activation link sent to email'
        })

    } catch (err) {
        console.log(err);
        return next(new AppError('There was an error sending the email. Try again later!'), 500)
    }

})

exports.signup = catchAsync(async(req, res, next)=>{
  
    // const hashedData = await Guest.generateNewHashandSalt(req.body.password)
    // .then(Guest.createEncyptPass);

    // const guestObject = {
    //     emailAddress: req.body.emailAddress,
    //     keyWord: hashedData.h,
    //     keyGen: hashedData.s,
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     isVerified: false,
    //     createdOn: new Date(),
    //     address: {
    //         address: req.body.address,
    //         city: req.body.city,
    //         postalCode: req.body.postalCode,
    //         country: req.body.country
    //     },
    //     isActive: false,
    //     reservations: [],
    //     formSubmissions: [],
    //     loyaltyHistory: []
    // }

    // if(req.body.mobileNumber){
    //     guestObject.mobileNumber = req.body.mobileNumber;
    // }

    // const newUser = await Guest.create(guestObject);

    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     status: 'success',
    //     token: token,
    //     data: {
    //         user: newUser
    //     }
    //     // data: guestObject,

    // });

    res.status(500).json({
        status: 'error',
        message: 'The signup route is not yet defined!'
    });
});

const signToken = (id, empType) => {
    const payload = {
        id: id
    }

    if(empType){
        payload.type = empType;
    } else {
        payload.type = "Guest";
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const loginUser = async(req, next, Model, userType="Guest" ) => {
    return new Promise((resolve)=>{
        // Set timeout of 1 second to delay brute force attacks
        setTimeout(async () => {
            const {email, password} = req.body;
    
            // 1.) if email and password exist
            if(!email || !password){
                return resolve(next(new AppError('Please provide email and password!', 400)));
            }
        
            // 2.) check if user exists 
            const user = await Model.findOne({emailAddress: email}).select('+keyWord +keyGen').maxTimeMS(20000);
        
            if(!user){
                return resolve(next(new AppError('Incorrect email or password!', 400)));
            }
        
            const {keyWord, keyGen, employeeType} = user;
        
            // 3.) check if user is active and verified
            switch(Model.modelName){
                case "employee":
                    if(user.status != 'active'){
                        return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                    }
                    if(employeeType){
                        if(userType === 'management'){
                            if(!(employeeType === 'admin' || employeeType === 'manager')){
                                return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                            }
                        } else {
                            if(employeeType != userType){
                                return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                            }
                        }
                    } else {
                        return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                    }
                    break;
                default: 
                    if(!user.isVerified){
                        return resolve(next(new AppError('Incorrect email or password!', 400)));
                    }
                    if(!user.isActive){
                        return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                    }
                    if(employeeType!=null){
                        return resolve(next(new AppError('Please contact your administrator for account access!', 403, true)));
                    }
            }

            // 4.) check if password is correct
            // to do also create in Employee & transfer to password utility
            const isCorrect = await Guest.correctPassword(password, keyGen, keyWord);
        
            if(!isCorrect){
                return resolve(next(new AppError('Incorrect email or password!', 400)));
            }
        
            // 6.) if everything ok send token to client
            resolve({
                token: signToken(user._id, user?.employeeType),
                id: user._id,
                type: user?.employeeType
            });
        }, "1000");
    });
};

exports.loginEmployee = catchAsync(async(req, res, next) => {
    const loginData = await loginUser(req, next, Employee, 'staff');

    if(loginData?.token){
        // Set token in HTTP-only cookie
        res.cookie('jwt', loginData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expiresIn: new Date(
                // Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                Date.now() + process.env.COOKIE_EXPIRES_IN * 60 * 1000 //minutes
            )
        });
        res.status(201).json({
            status: 'success',
            token: loginData.token,
            statusCode: 201,
            id: loginData.id
        });
    } 
});

exports.loginManagement = catchAsync(async(req, res, next) => {
    const loginData = await loginUser(req, next, Employee, 'management');

    if(loginData?.token){
        // Set token in HTTP-only cookie
        res.cookie('jwt', loginData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expiresIn: new Date(
                // Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                Date.now() + process.env.COOKIE_EXPIRES_IN * 60 * 1000 //minutes
            )
        });
        res.status(201).json({
            status: 'success',
            token: loginData.token,
            statusCode: 201,
            id: loginData.id,
            url: loginData.type == "admin" ? `/dashboard/USNVMQD493/${loginData.id}` : `/dashboard/manager/${loginData.id}`
        });
    } 
});

exports.loginGuest = catchAsync(async(req, res, next) => {
    const loginData = await loginUser(req, next, Guest);
    if(loginData?.token){
        // Set token in HTTP-only cookie
        res.cookie('jwt', loginData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expiresIn: new Date(
                // Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                Date.now() + process.env.COOKIE_EXPIRES_IN * 60 * 1000 //minutes
            )
        });
        res.status(201).json({
            status: 'success',
            token: loginData.token,
            statusCode: 201,
            id: loginData.id
        });
    } 
})


exports.protect = catchAsync(async(req, res, next)=>{
    let token;

    // 1.) Get token & check if it exists
    if(req?.headers?.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }

    // 2.) Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.decoded = decoded;

    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if( req.user && !roles.includes(req.user.employeeType)) {
            return next(new AppError('You do not have access to this resource/action!', 403));
        }
        next();
    }
}

exports.verifyEmployee = catchAsync(async(req, res, next)=>{
    // 3.) Check if user still exists
    const existing = await Employee.findById(req.decoded.id);

    if(!existing){
        return next(new AppError('You do not have access to this resource/action!', 403));
    }

    // 4.) Check if user is active
    if(!(existing.status === "active")){
        return next(new AppError('You do not have access to this resource/action!', 403));
    }

    // 5.) Check if user changed password after route was issued
    if(existing.changedPasswordAfter(req.decoded.iat)){
        res.clearCookie("jwt");
        return next(new AppError('Session expired. Please login!', 401));
    }

    req.user = existing;
    // grant access to route
    next();
});

exports.verifyGuest = catchAsync(async(req, res, next)=>{
    // 3.) Check if user still exists
    const existing = await Guest.findById(req.decoded.id);

    if(!existing){
        return next(new AppError('You do not have access to this resource/action!', 403));
    }

    // 4. check if user is active and verified
    if(!existing.isVerified){
        res.clearCookie("jwt");
        return next(new AppError('Session expired. Please login!', 401));
    }
    if(!existing.isActive){
        return next(new AppError('You do not have access to this resource/action!', 403));
    }

    // 5.) Check if user changed password after route was issued
    if(existing.changedPasswordAfter(req.decoded.iat)){
        res.clearCookie("jwt");
        return next(new AppError('Session expired. Please login!', 401));
    }

    req.user = existing;
    req.user.employeeType = existing?.employeeType??"guest";
    next();
});


exports.detect = catchAsync(async(req, res, next)=>{
    let token;

    if (req.cookies.jwt){
        // check if token exists
        token = req.cookies.jwt;
    }

    if(token){
        // verify token if existing
        try{
            req.decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        } catch(err){
            // remove cookie & send pop up to client when expired/incorrect token
            req.alertToLogin = true;
            res.clearCookie("jwt");
        }
    }
    
    return next();
});

exports.logout = (req, res, next) => {
    if (req.cookies.jwt){
        res.clearCookie("jwt");
    }
    res.status(200).json({
        status: 'success',
        statusCode: 200
    })
}

exports.logoutRedirect = (req, res, next) => {
    if (req.cookies.jwt){
        res.clearCookie("jwt");
    }
    res.redirect('/');
}

exports.cacheControl = catchAsync(async(req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});



exports.forgotPasswordGuest = catchAsync( async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await Guest.findOne({emailAddress: req.body.emailAddress});

    if(!user){
        return res.send({"message": "If the email address you entered is associated with an account, we'll send you a password reset link. Please check your inbox (and your spam/junk folder, just in case) for further instructions."})
    }

    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    try {
        // 3) Send it to users email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/guests/resetPassword/${resetToken}`;

        await (new Email(user, resetURL)).sendForgotPasswordLink();

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Token sent to email'
        })

    } catch (err) {
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('There was an error sending the email. Try again later!'), 500)
    }

});

exports.resetPasswordGuest = catchAsync(async (req, res, next) => {
    const {password, passwordConfirm} = req.body;
    
    // 1.) if email and password exist
    if(!password || !passwordConfirm){
        return resolve(next(new AppError('Please provide password and confirmed password!', 400)));
    }

    // 2.) check if user exists 
    // 2.a) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2.b) Set new password only if token has not expired and user exists
    const user = await Guest.findOne({passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    if(!user){
        return next(new AppError('Token is invalid or has expired', 400))
    }

    // 3.) Update password properties for the user
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4.) Log user in, send JWT
    const token = signToken(user._id, user?.employeeType);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        token
    });
});


// TODO
exports.forgotPasswordEmployee = catchAsync( async (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'The resetPasswordEmployee route is not yet defined!'
    });

    // // 1) Get user based on POSTed email
    // const user = await Employee.findOne({emailAddress: req.body.emailAddress, passwordResetExpires: {$gt: Date.now()}});

    // if(!user){
    //     return res.send({"message": "If the email address you entered is associated with an account, we'll send you a password reset link. Please check your inbox (and your spam/junk folder, just in case) for further instructions."})
    // }

    // // 2) Generate random reset token
    // const resetToken = user.createPasswordResetToken();
    // await user.save({validateBeforeSave: false});


    // // 3) Send it to users email
    // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/guests/resetPassword/${resetToken}`;

    // const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email!`

    // try {
    //     await sendEmail({
    //         email: user.emailAddress,
    //         subject: 'Your password reset token (valid for 10 min)',
    //         message 
    //     });

    //     res.status(200).json({
    //         status: 'success',
    //         statusCode: 200,
    //         message: 'Token sent to email'
    //     })

    // } catch (err) {
    //     console.log(err);
    //     user.passwordResetToken = undefined;
    //     user.passwordResetExpires = undefined;
    //     await user.save({validateBeforeSave: false});

    //     return next(new AppError('There was an error sending the email. Try again later!'), 500)
    // }

});

// TODO
exports.resetPasswordEmployee = catchAsync(async (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'The resetPasswordEmployee route is not yet defined!'
    });
    // const {email, password} = req.body;

    // // 1) Get user based on the token
    // const hasedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // // 2) Set new password only if token has not expired and user exists
    // const user = await Employee.findOne();

    // // 3.) Update ChangedPasswordAt property for the user

    // // 4.) Log user in, send JWT
});

const checkActivationCode = async(req, res, next ) => {
    return new Promise((resolve, reject)=>{
        // Set timeout of 1 second to delay brute force attacks
        setTimeout(async () => {
            const {email, verificationCode} = req.body;
            console.log(`activateAccount(checkActivationCode): email: ${email}, verificationCode:${verificationCode}`);

            // check if email exists
            try {
                const foundRegisteredUser = await Guest.findOne({emailAddress: email});
                
                // REFACTOR instead of using session variable to control when emails can be sent
                if(!foundRegisteredUser) {
                    // TODO if not exist send email success anywy
                }

                // check if user !isValidated
                if(!foundRegisteredUser.isActive) {
                    // TODO Send contact admin email
                }
                
                // check if user !isActive
                if(!foundRegisteredUser.isVerified){
                    // TODO Send Login email
                }

                // verify the activation code
                if(foundRegisteredUser.activationCode === verificationCode){
                    delete req.session.resendLinkexpiry;
                    delete foundRegisteredUser.resendLinkexpiry;
                    delete foundRegisteredUser.activationResendExpires;
                    delete foundRegisteredUser.activationToken;
                    foundRegisteredUser.isVerified = true;
                    await foundRegisteredUser.save({validateBeforeSave: false});
                    // await foundRegisteredUser.save({validateBeforeSave: false});
                }

                // Default is activation code is not valid
            } catch(err) {
                reject({status: "fail"})
            }

            resolve({status: "success", message:"updated"});
        }, "1000");
    });
};

// TODO
exports.activateAccount = catchAsync(async (req, res, next) => {
    console.log('Authcontroller activate account')
    const activationResult = await checkActivationCode(req, res, next)
    .then((result)=>{
       delete req.session.createdAccount;
       return {
        status: result.status,
        result: result.message
       }
    })
    .catch((err)=>{
        return {
            status: "failure",
            message: err
        }
    });

    if(activationResult.status === "failure"){
        return next(new AppError(err, 500));
    }

    console.log(`activation ${activationResult.status} ${activationResult.status === "success"}`)
    console.log(JSON.stringify(activationResult));
    const statusCode = activationResult.status === "success" ? 200 : 500;
    res.status(statusCode).json({
        statusCode,
        status: activationResult.status,
        message: activationResult.message
    });
});

// TODO
const requestActivationCode = async(req, res, next ) => {
    return new Promise((resolve, reject)=>{
        // Set timeout of 1 second to delay brute force attacks
        setTimeout(async () => {
            const {email} = req.body;
            console.log(`requestActivationResetCode: email: ${email}`);
            // check if email exists
            try {

            } catch (err) {
                reject()
            }
            // if exists check if time is spend
            // if not exist send response anyway but not email
            resolve({
            });
        }, "1000");
    });
};

// TODO
exports.requestActivationResetCode = catchAsync(async (req, res, next) => {
    requestActivationCode(req, res, next)
    .then(()=>{
        res.status(500).json({
            status: 'error',
            message: 'The requestActivationResetCode route is not yet defined!'
        });
    })
    .catch(()=>{
        return next(new AppError('Something went wrong with requesting the activation code', 500))
    })
});




