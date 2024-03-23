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