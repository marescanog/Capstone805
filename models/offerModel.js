const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const { calendarImplementationSubSchema, photoSubSchema }  = require('./modelUtils/subSchemas.js');

// not to be confused with room surcharge / surcharge by date
// where it tracks the seasonal fluctuations
const offerSurcharge = new mongoose.Schema({
    chargeType: {
        type: String,
        required: [true, 'must have a charge type'],
        enum: {
            values: ['flatRate','percent'],
            message: "must be part of categories"
        }
    },
    chargeValue: {
        type: Decimal128,
        required: [true, 'must have a charge Value'],
    }
});

// offers can be paired with rooms
// offers are what is displayed when guest searches for a room
const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name'],
    },
    description: String,
    offerType: {
        type: String,
        required: [true, 'must have an offer type'],
        enum: {
            values: ['base','promotional', 'loyaltyAdd', 'loyaltySpend'],
            message: "must be part of categories"
        }
    },
    addedAmenities: {
        type: [String],
        required: [true, 'must have a list of additional amenities'],
    },
    offerCalendarImplementation: {
        type: calendarImplementationSubSchema,
        required: [true, 'must have a calendar implementation'],
    },
    isSuspended: {
        type: Boolean,
        required: [true, 'must have a flag to show if suspended'],
        default: false
    },
    reasonForSuspension: String,
    isFeatured: {
        type: Boolean,
        required: [true, 'must have a flag to show if featured'],
        default: false
    },
    offerPhotos: {
        type: [photoSubSchema],
        required: [true, 'must have a list of photos'],
    },
    promotions: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true, 'must have a list of promotion references'],
    },
    offerSurcharge: offerSurcharge,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have a reference to a creator'],
    },
    createdOn: {
        type: Date,
        required: [true, 'must have a creation date'],
        default: new Date()
    }
});

// checks offer calendar implementation and compares it with current date
// to see if offer is in effect
offerSchema.methods.isOfferInEffect = function(currentDate){
    // TODOS
    let retVal = false;
    if(this.offerCalendarImplementation.dateType == "season"){
        retVal = true;
    }
    return  retVal;
}

const Offer = mongoose.model('offer', offerSchema);

module.exports = Offer;