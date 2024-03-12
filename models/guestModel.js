const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {addressSubSchema} = require('./modelUtils/subSchemas.js');
const {Decimal128} = mongoose.Types;

const  promoSubschema = new mongoose.Schema({
    promoType : {
        type: String,
        required: [true, 'must have an email'],
    },
    name : {
        type: String,
        required: [true, 'must have an email'],
    },
    discountType : {
        type: String,
        required: [true, 'must have an email'],
    },
    discountValue : {
        type: Decimal128,
        required: [true, 'must have an email'],
    },
});

const  feesSubschema = new mongoose.Schema({
    feeType : {
        type: String,
        required: [true, 'must have an email'],
    },
    amount : {
        type: Decimal128,
        required: [true, 'must have an email'],
    }
});

const  priceBreakdownSubschema = new mongoose.Schema({
    totalCharge : {
        type: Decimal128,
        required: [true, 'must have an email'],
    },
    totalPaid : {
        type: Decimal128,
        required: [true, 'must have an email'],
    },
    fees : {
        type: [feesSubschema],
        required: [true, 'must have an email'],
    },
    promotions : {
        type: [promoSubschema],
        required: [true, 'must have an email'],
    },
});

const paymentDetailsSubschema = new mongoose.Schema({
    cardType : {
        type: String,
        required: [true, 'must have an email'],
    },
    lastFour : {
        type: String,
        required: [true, 'must have an email'],
    }
});

const roomDetailsSubschema = new mongoose.Schema({
    roomID : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have an '],
    },
    roomOfferID : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have an '],
    },
    roomType: {
        type: String,
        required: [true, 'must have '],
    },
    amenities: [String],
    bedType: {
        type: String,
        required: [true, 'must have '],
    },
    numberOfBeds: {
        type: Number,
        required: [true, 'must have '],
    },
    pricePerNight: {
        type: Decimal128,
        required: [true, 'must have '],
    }
});

const reservationSubschema = new mongoose.Schema({
    reservationID : {
        type: String,
        required: [true, 'must have reservationID'],
    },
    roomDetails : {
        type: roomDetailsSubschema,
        required: [true, 'must have roomDetails'],
    },
    numberOfRooms: {
        type: Number,
        required: [true, 'must have numberOfRooms'],
    },
    checkinDate: {
        type: Date,
        required: [true, 'must have checkinDate'],
    },
    checkoutDate: {
        type: Date,
        required: [true, 'must have checkoutDate'],
    },
    status: {
        type: String,
        required: [true, 'must have status'],
    },
    numberOfGuests: {
        type: Number,
        required: [true, 'must have numberOfGuests'],
    },
    createdOn: {
        type: Date,
        required: [true, 'must have createdon'],
    },
    estimatedArrivalTime:{
        type: String,
        required: [true, 'must have status'],
    },
    paymentDetails: {
        type: paymentDetailsSubschema,
        required: [true, 'must have paymentDetails'],
    },
    priceBreakdown: {
        type: priceBreakdownSubschema,
        required: [true, 'must have priceBreakdown'],
    }
});

const guestSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: [true, 'must have an email'],
        unique: true,
        validate: [validator.isEmail, 'email address must be a valid email']
    },
    keyWord: {
        type: String,
        required: [true, 'must have this field'],
        minlength: [10, 'incorrect number of characters'],
        select: false
    },
    keyGen: {
        type: String,
        required: [true, 'must have this field'],
        minlength: [10, 'incorrect number of characters'],
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'must have a first name']
    },
    lastName: String,
    mobileNumber: String,
    isVerified: {
        type: Boolean,
        required: [true, 'must have a flag'],
        default: false
    },
    createdOn: {
        type: Date,
        required: [true, 'must have a date'],
        default: new Date()
    },
    address: {
        type: addressSubSchema,
        required: [true, 'must have an address']
    },
    isActive: {
        type: Boolean,
        required: [true, 'must have a flag'],
        default: false
    },
    reservations : [reservationSubschema],
    formSubmissions : [String],
    loyaltyHistory: [String]
});

guestSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return  await bcrypt.compare(candidatePassword, userPassword);
}

// maybe transfer to Auth Controller
// Can also be used for updating passwords
guestSchema.methods.generateNewHashandSalt = function(newPassword){
    const salt = randomStr.randomLetters(10, "uppercase");
    const secret = newPassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(newPassword);
    const digest = update.digest('hex');
    return  {h:digest, s:salt};
}

// User.findOne({email}).select('+keyWord +keyGen') // pass to here
guestSchema.methods.getPassword = function(candidatePassword, salt){
    const secret = candidatePassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(candidatePassword);
    const digest = update.digest('hex');
    return  digest;
}

guestSchema.statics.getHotelLaunchDate = function(){
    return new Date(2023, 10, 1);
}

guestSchema.statics.getTotalReservationsByDateAndRoomType  = async function(date, roomType){
    const startOfDay = new Date(date);
    const endOfDay  = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);
    // console.log(`end of day is ${endOfDay}`)
    const reservations = await this.aggregate([
        { $unwind: '$reservations' },
        { $match: {
            'reservations.checkinDate': { $lte: startOfDay },
            'reservations.checkoutDate': { $gt: endOfDay },
            'reservations.roomDetails.roomType': roomType
        }},
        { $count: "numberOfReservations" }
    ])
    return reservations.length > 0 ? (reservations[0]).numberOfReservations : 0;
}

guestSchema.statics.getReservationByID  = async function(reservationID){
    const reservations = await this.aggregate([
        { $unwind: '$reservations' },
        { $match: {'reservations.reservationID': reservationID}},
        { $project: {_id: 0, reservation:'$reservations'} }
    ])

    return reservations.length > 0 ? reservations[0] : null;
}

const Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;