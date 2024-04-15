const catchAsync = require('../apiUtils/catchAsync.js');
const Guest = require('../models/guestModel.js');
const AppError = require('../apiUtils/appError.js');
const {createReservation} = require('../models/modelUtils/multiModelFunctions.js'); 

exports.getAllReservations = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getAllReservations route is not yet defined!'
    });
}

exports.createReservation = catchAsync(async(req, res, next) => {
    // Validate the passed data
    const {isMainGuest, firstName, lastName, mobileNumber, address, city, postalCode, 
        specialRequest, arrivalTime, cardHolderName, cardNumber, expiryDate, cardCVC, billingAddress, 
        billingCity, billingPostal, loyaltyCheck, loyaltyValue, sameBillingAddress, billingCountry
    } = req.body;
    // console.log(req.body)
    // Validate the data but since no time just pass it in object
    const formdata = {
        isMainGuest: isMainGuest,
        firstName:firstName, 
        lastName: lastName,
        mobileNumber: mobileNumber, 
        address: address,
        city: city, 
        postalCode: postalCode,
        specialRequest: specialRequest,
        arrivalTime: arrivalTime,
        cardHolderName: cardHolderName, 
        cardNumber:cardNumber, 
        expiryDate: expiryDate,
        cardCVC: cardCVC, 
        billingAddress: billingAddress, 
        billingCity: billingCity, 
        billingPostal: billingPostal,
        loyaltyCheck: loyaltyCheck, 
        loyaltyValue:loyaltyValue,
        sameBillingAddress: sameBillingAddress,
        billingCountry: billingCountry
    }

    // only create reservations for those who are logged in
    if(!req?.decoded?.id){
        return res.json({ success: false, message: "Failed to create reservation. You are not logged in! Please try again." });
    }

    if(!req.session.checkout){
        return res.json({ success: false, message: "Failed to create reservation. Your checkout session is timed out! Please try again." });
    }

    try {
        const result = await createReservation(req?.decoded?.id, req.session.checkout, formdata);
        // console.log('reservation controller')
        // console.log(JSON.stringify(result, null, '\t'))
        if(result.status === "success"){
            delete req.session.checkout
        }
    } catch (err){
        if(err instanceof AppError){
            return next(new AppError(err.errMessage, 500, true, false));
        }
    }

    // delete all holds with session
    // delete checkout session
    // res.send(req.body)
    try {
        return res.json({ success: true, message: "Reservation created successfully!" });
    } catch (error){
        console.error("Save failed:", error);
        res.json({ success: false, message: "Failed to create reservation. Please try again." });
    }
})

exports.getReservation = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getReservation route is not yet defined!'
    });
}

exports.updateReservation = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The updateReservation route is not yet defined!'
    });
}