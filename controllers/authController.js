const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Guest = require('../models/guestModel.js');
const Employee = require('../models/employeeModel.js');
const catchAsync = require('./../apiUtils/catchAsync');
const AppError = require('../apiUtils/appError.js');

const {Types} = mongoose;

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const loginUser = async(req, next, Model ) => {
    const {email, password} = req.body;

    // 1.) if email and password exist
    if(!email || !password){
       return next(new AppError('Please provide email and password!', 400));
    }

    // 2.) check if user exists 
    const user = await Model.findOne({emailAddress: email}).select('+keyWord +keyGen');

    if(!user){
        return next(new AppError('Incorrect email or password!', 400));
    }

    const {keyWord, keyGen} = user;

    // 2.) check if password is correct
    // to do also create in Employee & transfer to password utility
    const isCorrect = await Guest.correctPassword(await Guest.getKeywordFromCandidate(password, keyGen), keyWord);

    if(!isCorrect){
        return next(new AppError('Incorrect email or password!', 400));
    }

    // 3.) if everything ok send token to client
    return signToken(user._id);
};

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


exports.loginEmployee = catchAsync(async(req, res, next) => {
    const token = await loginUser(req, next, Employee);
    res.status(201).json({
        status: 'success',
        token: token
    });
});


exports.loginGuest = catchAsync(async(req, res, next) => {
    const token = await loginUser(req, next, Guest);
    res.status(201).json({
        status: 'success',
        token: token
    });
})


exports.protect = catchAsync(async(req, res, next)=>{
    let token;
    // 1.) Get token & check if it exists
    if(req?.headers?.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }

    // 2.) Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);



    req.decoded = decoded;

    next();
});

exports.verifyEmployee = catchAsync(async(req, res, next)=>{

    // 3.) Check if user still exists
    const existing = await Employee.findById(req.decoded.id);

    if(!existing){
        return next(new AppError('Token expired. Please login!', 401));
    }

    // 4.) Check if user changed password after route was issued
    if(existing.changedPasswordAfter(req.decoded.iat)){
        return next(new AppError('Token expired. Please login!', 401));
    }

    req.user = existing;
    // grant access to route
    next();
})

exports.verifyGuest = catchAsync(async(req, res, next)=>{
    // // 3.) Check if user still exists
    // const existing = await Employee.findById(req.decoded.id);

    // // 4.) Check if user changed password after route was issued
    // console.log(existing)

    // next();
})