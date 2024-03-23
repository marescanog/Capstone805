const mongoose = require('mongoose');
const Guest = require('../models/guestModel.js');
const catchAsync = require('./../apiUtils/catchAsync');

const {Types} = mongoose;

exports.signup = catchAsync(async(rer, res, next)=>{

    // const guestObject = {
    //     emailAddress: req.body.emailAddress,
    //     keyWord: "",
    //     keyGen: "",
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

    // res.status(201).json({
    //     status: 'success',
    //     data: {
    //         user: newUser
    //     }
    // })

    res.status(500).json({
        status: 'error',
        message: 'The signup route is not yet defined!'
    });
});