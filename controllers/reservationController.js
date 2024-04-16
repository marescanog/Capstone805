const catchAsync = require('../apiUtils/catchAsync.js');
const Guest = require('../models/guestModel.js');
const AppError = require('../apiUtils/appError.js');
const {createReservation} = require('../models/modelUtils/multiModelFunctions.js'); 
const {formatDate_DD_MON_YYYY} = require('../models/modelUtils/utilityFunctions.js'); 
const mongoose = require('mongoose');

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

exports.updateReservation = async (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'The updateReservation route is not yet defined!'
    });
}

exports.getUpcomingreservations = async (guestID) => {
    let mappedReservationData = [];
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 

    try {
        const reservations = await Guest.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(guestID) 
                }
            },
            {
                $unwind: '$reservations' 
            },
            {
                $match: {
                    'reservations.status': 'pending',
                    'reservations.checkinDate': { $gte: today }
                }
            },
            {
                $lookup: {
                    from: 'rooms', 
                    localField: 'reservations.roomDetails.roomID', // Field in guest reservations
                    foreignField: '_id', // Corresponding field in rooms collection
                    pipeline: [
                        { $project: { _id: 0, 'thumbnail': '$thumbNail.small.url', 'thumbnailfileType':'$thumbNail.small.fileType' } }
                    ],
                    as: 'roomThumbnail' // Changed from 'extraRoomDetails' for clarity
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the guest _id from the output
                    reservationDetails: '$reservations', 
                    thumbnail: { $arrayElemAt: ['$roomThumbnail.thumbnail', 0] }, // Adjusted to correct the thumbnail extraction
                    filtype: { $arrayElemAt: ['$roomThumbnail.thumbnailfileType', 0] }
                }
            }
        ]);

        mappedReservationData = await Promise.all(
            reservations.map(el=>{
                const {thumbnail, filtype, reservationDetails} = el;
                const {reservationID, _id, numberOfGuests, checkinDate, checkoutDate, roomDetails} = reservationDetails;
                const {roomType, pricePerNight} = roomDetails
                let price = (parseFloat(pricePerNight)).toFixed(2)
                return {
                    thumbNail: `${process.env.AWS_ROOM_TYPE_IMAGE_URL}${thumbnail}.${filtype}`,
                    alt: `${roomType} thumbnail image`,
                    roomType: roomType,
                    checkinDate: formatDate_DD_MON_YYYY(checkinDate),
                    checkoutDate: formatDate_DD_MON_YYYY(checkoutDate),
                    numberOfGuests: numberOfGuests,
                    averagePricePerNight: price,
                    reservationID: reservationID,
                    linkrefID: _id,
                    checkinDateObj: checkinDate,
                    checkoutDateObj: checkoutDate
                }
            }) 
        )
        // console.log(JSON.stringify(reservations, null, '\t'))
    } catch (err){
        console.log(err);
        throw new AppError('Could not find reservations, please try again!', 404)
    }
    return {
        success: true,
        data: mappedReservationData 
    }
}

exports.getPastreservations = async (guestID) => {
    let mappedReservationData = [];
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 

    try {
        const reservations = await Guest.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(guestID) 
                }
            },
            {
                $unwind: '$reservations' 
            },
            {
                $match: {
                    'reservations.status': { $ne: 'pending' },
                    'reservations.checkinDate': { $lt: today }
                }
            },
            {
                $lookup: {
                    from: 'rooms', 
                    localField: 'reservations.roomDetails.roomID', // Field in guest reservations
                    foreignField: '_id', // Corresponding field in rooms collection
                    pipeline: [
                        { $project: { _id: 0, 'thumbnail': '$thumbNail.small.url', 'thumbnailfileType':'$thumbNail.small.fileType' } }
                    ],
                    as: 'roomThumbnail' // Changed from 'extraRoomDetails' for clarity
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the guest _id from the output
                    reservationDetails: '$reservations', 
                    thumbnail: { $arrayElemAt: ['$roomThumbnail.thumbnail', 0] }, // Adjusted to correct the thumbnail extraction
                    filtype: { $arrayElemAt: ['$roomThumbnail.thumbnailfileType', 0] }
                }
            }
        ]);

        mappedReservationData = await Promise.all(
            reservations.map(el=>{
                const {thumbnail, filtype, reservationDetails} = el;
                const {reservationID, _id, numberOfGuests, checkinDate, checkoutDate, roomDetails} = reservationDetails;
                const {roomType, pricePerNight} = roomDetails
                // console.log(pricePerNight)
                let price = (parseFloat(pricePerNight)).toFixed(2)
                return {
                    thumbNail: `${process.env.AWS_ROOM_TYPE_IMAGE_URL}${thumbnail}.${filtype}`,
                    alt: `${roomType} thumbnail image`,
                    roomType: roomType,
                    checkinDate: formatDate_DD_MON_YYYY(checkinDate),
                    checkoutDate: "31 Jan 2021",
                    numberOfGuests: numberOfGuests,
                    averagePricePerNight: price,
                    reservationID: reservationID,
                    linkrefID: _id
                }
            }) 
        )
        // console.log(JSON.stringify(reservations, null, '\t'))
    } catch (err){
        console.log(err);
        throw new AppError('Could not find reservations, please try again!', 404)
    }
    return {
        success: true,
        data: mappedReservationData 
    }
}