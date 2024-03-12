const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const { calendarImplementationSubSchema, photoSubSchema } = require('./modelUtils/subSchemas.js');
const PriceChangeTrend = require('./priceChangeTrendModel.js');

const roomNumberSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'must have a number'],
        unique: true
    },
    floorNumber: {
        type: String,
        required: [true, 'must have a floor'],
    },
    guestID: mongoose.Schema.Types.ObjectId
});

const amenitySubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name'],
    },
    icon: String,
    category: {
        type: String,
        required: [true, 'must have a category'],
    },
    sortOrder: Number
});

const promotionsRoomSubSchema = new mongoose.Schema({
    promoReferenceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have a reference ID'],
    },
    name: {
        type: String,
        required: [true, 'must have a name'],
    },
    promoType: {
        type: String,
        required: [true, 'must have a category'],
        default: 'fixed discount',
        enum: {
            values: ['fixed discount','compensation', 'partnered', 'package'],
            message: "must be part of categories"
        }
    },
    promoDetails:{
        priceChangeType: {
            type: String,
            required: [true, 'must have a price change type'],
            enum: {
                values: ['flatRateIncrease','percentIncrease', 'flatRateDecrease', 'percentDecrease'],
                message: "must be part of categories"
            }
        },
        priceChangeValue: {
            type: Decimal128,
            required: [true, 'must have a price change Value'],
        }
    },
    description: {
        type: String,
        required: [true, 'must have a description'],
    },
    dateDeactivated: Date,
    promotionsPhotos : {
        type: [photoSubSchema],
        required: [true, 'must have a list of photos'],
    },
    promoCalendarImplementation: {
        type: calendarImplementationSubSchema,
        required: [true, 'must have a calendar implementation'],
    }
});

const offerSurchargeRoomSubSchema = new mongoose.Schema({
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

const offersRoomSubSchema = new mongoose.Schema({
    offerReferenceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have a reference ID'],
    },
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
        type: [amenitySubSchema],
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
        type: [promotionsRoomSubSchema],
        required: [true, 'must have a list of promotion references'],
    },
    offerSurcharge: offerSurchargeRoomSubSchema
});

const priceChangeTrendsSubSchema = new mongoose.Schema({
    priceChangeTrendReferenceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have a reference ID'],
    },
    name: {
        type: String,
        required: [true, 'must have a name'],
    },
    description: String,
    priceChangeType: {
        type: String,
        required: [true, 'must have a price change type'],
        enum: {
            values: ['flatRateIncrease','percentIncrease', 'flatRateDecrease', 'percentDecrease'],
            message: "must be part of categories"
        }
    },
    priceChangeValue: {
        type: Decimal128,
        required: [true, 'must have a price change Value'],
    },
    priceChangeCalendarImplementation: {
        type: calendarImplementationSubSchema,
        required: [true, 'must have a calendar implementation'],
    },
    isActive: {
        type: Boolean,
        required: [true, 'must have a flag to check if active'],
        default: true
    }
});

const holdSubSchema = new mongoose.Schema({
    holdID: {
        type: String,
        required: [true, 'must have a hold ID'],
    },
    sessionID: {
        type: String,
        required: [true, 'must have a session ID'],
    },
    guestID: mongoose.Schema.Types.ObjectId,
    holdStartDateTime: {
        type: Date,
        required: [true, 'must have a hold time'],
        default:new Date()
    },
});

const miscInfo = new mongoose.Schema({
    extraPersonFee: Decimal128,
    maxExtraPersonAllowed: Number,
    maxAllowedGuests: Number,
});

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: [true, 'A room must have a name'],
        unique: true
    },
    thumbNail: {
        small: photoSubSchema,
        large: photoSubSchema
    },
    description: {
        type: String,
        required: [true, 'A room must have a description']
    },
    basePrice: {
        type: Decimal128,
        required:  [true, 'A room must have a basePrice']
    },
    totalQuantity: {
        type: Number,
        required:  [true, 'A room must have a total quantity'],
        min: [1, 'quantity must be above 0']
    },
    todaysRoomAssignments: {
        type: [roomNumberSchema],
        required:  [true, 'A room must have a list of room numbers'],
        min: [1, 'quantity must be above 0']
    },
    category: {
        type: String,
        required:  [true, 'A room must have a category'],
        enum: {
            values: ['Budget Room','Regular Room','Luxury Suite'],
            message: "must be part of categories"
        }
    },
    bedType: {
        type: String,
        required:  [true, 'A room must have a bed type'],
        enum: {
            values: ['Single','Twin','King','Queen'],
            message: "must be part of categories"
        }
    },
    bedCount: {
        type: Number,
        required:  [true, 'A room must have a bed count'],
        min: [1, 'quantity must be above 0']
    },
    basePhotos: {
        type: [photoSubSchema],
        required:  [true, 'A room must have a list of photos'],
        min: [1, 'count must be above 0']
    },
    baseAmenities: {
        type: [amenitySubSchema],
        required:  [true, 'A room must have a list of amenities']
    },
    offers: {
        type: [offersRoomSubSchema],
        required:  [true, 'A room must have a list of offers']
    },
    priceChangeTrends: {
        type: [priceChangeTrendsSubSchema],
        required:  [true, 'A room must have a list of priceChangeTrends']
    },
    hold: {
        type: [holdSubSchema],
        required:  [true, 'A room must have a list of holds']
    },
    miscInfo: miscInfo
});

// Returns just the list of trends a room has that is active
roomSchema.methods.getAllActiveTrends = async function(){
    const newArr = await Promise.all(
        this.priceChangeTrends.filter(trend => trend.isActive)
    )
    return new Promise((resolve, reject)=>{
        resolve(newArr)
    });
}

// Applicable Trends are trends that are within range of the current date
roomSchema.methods.getAllApplicableTrendsFromArray = async function(arr){
    const newArr = await Promise.all(
        arr.map( async (trend) =>{
            if(trend?.priceChangeCalendarImplementation){
                if(await PriceChangeTrend.currentDateFallsWithinSpecifiedTrendRange(trend.priceChangeCalendarImplementation)){
                    return trend;
                }
                // uncomment below and comment above for testing manually
                return await PriceChangeTrend.currentDateFallsWithinSpecifiedTrendRange(trend.priceChangeCalendarImplementation)
            } 
            return false;
        })
    )
    return new Promise((resolve)=>{
        // filters out null/false values
        resolve(newArr.filter(el=>el));
        // resolve(newArr);
    });
}

roomSchema.methods.computePriceBasedOnApplicableTrends = async function(trends, basePrice){
    const newArr = await Promise.all(
        trends.map( async (trend) =>{
            if(trend?.priceChangeType && trend?.priceChangeValue){
                switch(trend.priceChangeType){
                    case "flatRateIncrease":
                        return trend.priceChangeValue;
                    break;
                    case "percentIncrease":
                        return trend.priceChangeValue*basePrice;
                    break;
                    case "flatRateDecrease":
                        return -(trend.priceChangeValue);
                    break;
                    case "percentDecrease":
                        return -(trend.priceChangeValue*basePrice);
                    break;
                }
            }
            return 0;
        })
    )
    return new Promise((resolve)=>{
        // resolve(newArr);
        resolve(newArr.reduce(
            (accumulator, currentValue)=>{ return accumulator + currentValue},
            basePrice
        ));
    });
}

roomSchema.methods.getPriceOfRoomBasedOnApplicableTrends = async function(){

                // Step 1: Check if the trend is active
    return await this.getAllActiveTrends()
                // Step 2: Check if the current date falls within the date range specified in its calendar
                .then(roomSchema.methods.getAllApplicableTrendsFromArray)                 
                // // Step 3: return the price -> map it
                .then(async (result)=>{
                    const decimalValueAsString = this.basePrice.toString();
                    const decimalValueAsNumber = parseFloat(decimalValueAsString);
                    return await roomSchema.methods.computePriceBasedOnApplicableTrends(result, decimalValueAsNumber);
                })  
                // .then(res=>res);

}

const Room = mongoose.model('room', roomSchema);

module.exports = {Room, photoSubSchema, amenitySubSchema, promotionsRoomSubSchema, offersRoomSubSchema, offerSurchargeRoomSubSchema,priceChangeTrendsSubSchema, holdSubSchema};