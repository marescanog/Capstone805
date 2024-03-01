const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const bson = require('bson');

const photoSubSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        required: [true, 'A photo must have a name'],
        default: new Date()
    },
    url: {
        type: String,
        required: [true, 'A photo must have a url'],
    },
    altDescription: {
        type: Decimal128,
        required:  [true, 'A photo must have an altDescription']
    }
});

const amenitySubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An amenity must have a name'],
    },
    icon: String,
    category: {
        type: String,
        required: [true, 'An amenity must have a category'],
    }
});

const promotionsSubSchema = new mongoose.Schema({
    promoReferenceID: {
        type: String,
        required: [true, 'A promotion must have a reference ID'],
    },
    createdOn: {
        type: Date,
        required: [true, 'A promotion must have a date it was created on'],
        default: new Date()
    },
    createdBy: {
        type: bson.ObjectId,
        required: [true, 'A promotion must have a the id of the one who created it'],
    },
    discountType: {
        type: String,
        required: [true, 'A promotion must have a discount type'],
    },
    discountValue: {
        type: Decimal128,
        required: [true, 'A promotion must have a discount Value'],
    },
    promotionType: {
        type: String,
        required: [true, 'A promotion must have a promotion Type'],
    },
    name: {
        type: String,
        required: [true, 'A promotion must have a name'],
    },
    name: {
        type: String,
        required: [true, 'A promotion must have a name'],
    },
    description: {
        type: String,
        required: [true, 'A promotion must have a description'],
    },
    endDate: Date,
    dateDeactivated: Date,
    promotionPhotos : {
        type: [photoSubSchema],
        required: [true, 'A promotion must have a list of photos'],
    },
});

const offerSubSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'An offer must have an id'],
    },
    promotions: {
        type: [promotionsSubSchema],
        required: [true, 'An offer must have a list of promotions'],
    },
    offerPhotos: {
        type: [photoSubSchema],
        required: [true, 'An offer must have a list of photos'],
    },
    addedAmenities: {
        type: [amenitySubSchema],
        required: [true, 'An offer must have a list of additional amenities'],
    },
    surcharge: Object
});

const holdSubSchema = new mongoose.Schema({
    holdID: {
        type: String,
        required: [true, 'A tour must have a name'],
    },
    sessionID: {
        type: String,
        required: [true, 'A tour must have a name'],
    },
    guestID: bson.ObjectId,
    holdStartDateTime: {
        type: Date,
        required: [true, 'A tour must have a name'],
        default:new Date()
    },
});

const roomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'A room must have a name'],
        unique: true
    },
    thumbNail: String,
    description: {
        type: String,
        required: [true, 'A room must have a description'],
        default: 4.5
    },
    basePrice: {
        type: Decimal128,
        required:  [true, 'A room must have a basePrice']
    },
    totalQuantity: {
        type: Number,
        required:  [true, 'A room must have a total quantity']
    },
    category: {
        type: String,
        required:  [true, 'A room must have a category']
    },
    bedType: {
        type: String,
        required:  [true, 'A room must have a bed type']
    },
    bedCount: {
        type: Number,
        required:  [true, 'A room must have a bed count']
    },
    basePhotos: {
        type: [photoSubSchema],
        required:  [true, 'A room must have a list of photos']
    },
    baseAmenities: {
        type: [amenitySubSchema],
        required:  [true, 'A room must have a list of amenities']
    },
    offer: {
        type: [offerSubSchema],
        required:  [true, 'A room must have a list of offers']
    },
    hold: {
        type: [holdSubSchema],
        required:  [true, 'A room must have a list of holds']
    },
});

const Room = mongoose.model('room', roomSchema);

module.exports = {Room, photoSubSchema, amenitySubSchema, promotionsSubSchema, offerSubSchema, holdSubSchema};