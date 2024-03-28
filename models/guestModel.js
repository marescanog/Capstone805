const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {addressSubSchema, photoSubSchema} = require('./modelUtils/subSchemas.js');
const {Decimal128} = mongoose.Types;
const randomStr = require('random-string-alphanumeric-generator');

const  promoSubschema = new mongoose.Schema({
    promoType : {
        type: String,
        required: [true, 'must have an promotion type'],
        enum: {
            values: ['fixed discount','compensation', 'partnered', 'package','loyaltySpend'],
            message: "must be part of categories"
        }
    },
    name : {
        type: String,
        required: [true, 'must have an name'],
    },
    value : {
        type: Number,
        required: [true, 'must have a value'],
    },
    amount : Number,
    quantity: Number
});

const  feesSubschema = new mongoose.Schema({
    feeType : {
        type: String,
        required: [true, 'must have a type of fee'],
        enum: {
            values: ['base','tax', 'penalty'],
            message: "must be part of categories"
        }
    },
    amount : {
        type: Decimal128,
        required: [true, 'must have an a fee amount'],
    },
    name: String,
    quantity: Number
});

const  priceBreakdownSubschema = new mongoose.Schema({
    totalCharge : {
        type: Decimal128,
        required: [true, 'must have a total charge'],
    },
    totalPaid : {
        type: Decimal128,
        required: [true, 'must have a total paid'],
    },
    fees : {
        type: [feesSubschema],
        required: [true, 'must have a list of fees'],
    },
    promotions : {
        type: [promoSubschema],
        required: [true, 'must have a list of promotions'],
    },
});

const paymentDetailsSubschema = new mongoose.Schema({
    cardType : {
        type: String,
        required: [true, 'must have a card type'],
    },
    lastFour : {
        type: String,
        required: [true, 'must have a last four'],
    }
});

const roomDetailsSubschema = new mongoose.Schema({
    roomID : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have an id '],
    },
    roomOfferID : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have an id'],
    },
    roomType: {
        type: String,
        required: [true, 'must have a room type'],
    },
    amenities: [String],
    bedType: {
        type: String,
        required: [true, 'must have a bed type'],
    },
    numberOfBeds: {
        type: Number,
        required: [true, 'must have a number of beds'],
    },
    pricePerNight: {
        type: Decimal128,
        required: [true, 'must have a price per night'],
    }
});

const reservationSubschema = new mongoose.Schema({
    reservationID : {
        type: String,
        required: [true, 'must have an id'],
    },
    roomDetails : {
        type: roomDetailsSubschema,
        required: [true, 'must have details for the room'],
    },
    numberOfRooms: {
        type: Number,
        required: [true, 'must have a number of rooms'],
    },
    checkinDate: {
        type: Date,
        required: [true, 'must have check-in date'],
    },
    checkoutDate: {
        type: Date,
        required: [true, 'must have a check-out date'],
    },
    status: {
        type: String,
        required: [true, 'must have status'],
        enum: {
            values: ['pending', 'cancelled', 'checked-in', 'completed', 'no-show'],
            message: "must be part of categories"
        }
    },
    numberOfGuests: {
        type: Number,
        required: [true, 'must have a number of guests'],
    },
    createdOn: {
        type: Date,
        required: [true, 'must have created on'],
    },
    estimatedArrivalTime:{
        type: String,
        required: [true, 'must have arrival time'],
    },
    paymentDetails: {
        type: paymentDetailsSubschema,
        required: [true, 'must have payment details'],
    },
    priceBreakdown: {
        type: priceBreakdownSubschema,
        required: [true, 'must have price breakdown'],
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
    loyaltyHistory: [String],
    passwordChangedAt: {
        type: Date,
    },
    avatarPhotoUrl: photoSubSchema,
});

// refactor later
guestSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this?.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


guestSchema.statics.getKeywordFromCandidate = async (candidatepass, keygen) => {
    const secret = candidatepass+keygen;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(candidatepass);
    const digest = update.digest('hex');
    return new Promise((resolve, reject)=>{
        resolve(digest)
    })
}

guestSchema.methods.correctPassword = async function(candidatePassword, keygen, userPassword){
    return  await bcrypt.compare(await guestSchema.statics.getKeywordFromCandidate(candidatePassword, keygen), userPassword);
}

guestSchema.statics.correctPassword = async function(candidatePassword, keygen, userPassword){
    if(candidatePassword=="" || keygen == "" || userPassword == "" || candidatePassword == null || keygen == null || userPassword == null){
        return false;
    }
    return await bcrypt.compare(await guestSchema.statics.getKeywordFromCandidate(candidatePassword, keygen), userPassword);
}


// maybe transfer to Auth Controller
// Can also be used for updating passwords
guestSchema.methods.generateNewHashandSalt = async function(newPassword){
    const salt = randomStr.randomLetters(10, "uppercase");
    const secret = newPassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(newPassword);
    const digest = update.digest('hex');
    return  {h:digest, s:salt};
}

guestSchema.statics.generateNewHashandSalt = async function(newPassword){
    const salt = randomStr.randomLetters(10, "uppercase");
    const secret = newPassword+salt;
    const hash = crypto.createHmac('sha256',secret);
    const update = hash.update(newPassword);
    const digest = update.digest('hex');
    return  {h:digest, s:salt};
}

guestSchema.statics.createEncyptPass = async (cryptoHash) => {
    const hashedPass = await bcrypt.hash(cryptoHash.h, 12);
    return new Promise((resolve, reject)=>{
        resolve({h:hashedPass, s:cryptoHash.s})
    })
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