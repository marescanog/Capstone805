const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const { CalendarImplementation, calendarImplementationSubSchema, photoSubSchema } = require('./modelUtils/subSchemas.js');
const PriceChangeTrend = require('./priceChangeTrendModel.js');
const {isThisOfferInEffectOnThisDate} = require('./offerModel.js');

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
    },
    firstDayOnly: Boolean,
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

// Rewriting function above because it doesn't make sense
// how do you know the pricing of the trend based on the date?
roomSchema.methods.getPriceOfRoomBasedOnApplicableTrends = async function(date){
    const checkedDate = date ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const basePrice = parseFloat(this.basePrice.toString());
    const applicableRoomTrends = await Promise.all(
        this.priceChangeTrends.map(async (trend)=>{
            if(await trend.priceChangeCalendarImplementation.isCurrentDateWithinCalendarImplementation(
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                checkedDate
            )){
                return await trend.computePriceBasedOnTrend(basePrice);
            } else {
                return 0
            }
        })
    )

    // what you were doing, debugging accumulator
    // computing the price trend
    return new Promise((res)=>{
        // res(basePrice);
        // res(applicableRoomTrends);
        res(applicableRoomTrends.reduce(
            (accumulator, currentValue)=>{ return accumulator + currentValue},
            basePrice
        ));
    })
}

priceChangeTrendsSubSchema.methods.computePriceBasedOnTrend = async function(basePrice){
    let returnValue = 0;
    const pchangeval = parseFloat(this.priceChangeValue.toString())
    switch(this.priceChangeType){
        case "flatRateIncrease":
            returnValue = pchangeval;
        break;
        case "percentIncrease":
            returnValue = pchangeval*basePrice;
        break;
        case "flatRateDecrease":
            returnValue = -(pchangeval);
        break;
        case "percentDecrease":
            returnValue = -(pchangeval*basePrice);
        break;
    }
    return new Promise((res)=>{
        res(returnValue)
    })
}


//================== March 20, 2024

// TESTED DONE, further testing checks
roomSchema.methods.getOffersInEffectBasedOnProvidedDate = async function(date){
    const thisDate = date ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const retArr = await Promise.all(
        this.offers.map(async (el)=>{
            if(await el.isThisOfferInEffectOnThisDate(thisDate)){
                return  el;
            }
        })
    );
    return new Promise((res)=>{
        res(retArr.filter(el=>el!=null))
    })
};

offersRoomSubSchema.methods.isThisOfferInEffectOnThisDate = isThisOfferInEffectOnThisDate;

offersRoomSubSchema.methods.getSurcharge = async function(basePrice){
    let surcharge = 0;
    if(this.offerSurcharge != null){
        const pchangeval = parseFloat(this.offerSurcharge.chargeValue.toString())
        switch(this.offerSurcharge.chargeType){
            case "flatRate":
                surcharge = pchangeval;
            break;
            case "percent":
                surcharge = pchangeval*basePrice;
            break;
        }
    }
    return new Promise((res)=>{
        // res(surcharge)
        res(surcharge)
    })
}

offersRoomSubSchema.methods.getValidPromotionsList = async function(compareDate){
    const retArr = await Promise.all(
        this.promotions.map(async (el)=>{
            const {promoCalendarImplementation} = el;
            if(await calendarImplementationSubSchema.statics.isCurrentDateWithinCalendarImplementation(
                promoCalendarImplementation.dateType, 
                promoCalendarImplementation.dateTypeValue, 
                promoCalendarImplementation.frequencyType, 
                promoCalendarImplementation.frequencyPeriodStart, 
                promoCalendarImplementation.frequencyValue, 
                promoCalendarImplementation.frequencyPeriodEnd,
                compareDate
            )){
                return el;
            }
        })
    )
    return new Promise((res)=>{
        // res("hi")
        res(retArr.filter(el=>el!=null));
    })
}

promotionsRoomSubSchema.methods.getPromoPrice = async function(base){
    let promoPrice = 0;
    const {priceChangeType, priceChangeValue} = this.promoDetails;
    const priceChangeValAsFloat = parseFloat(priceChangeValue.toString());
    switch(priceChangeType){
        case "flatRateIncrease":
            promoPrice = priceChangeValAsFloat;
            break;
        case "percentIncrease":
            promoPrice = (priceChangeValAsFloat*base);
            break;
        case "flatRateDecrease":
            promoPrice = -priceChangeValAsFloat;
            break;
        case "percentDecrease":
            promoPrice = -(priceChangeValAsFloat*base);
            break;
    }
    return new Promise(res=>{
        res(promoPrice);
    })
}

const Room = mongoose.model('room', roomSchema);

module.exports = {Room, photoSubSchema, amenitySubSchema, promotionsRoomSubSchema, offersRoomSubSchema, offerSurchargeRoomSubSchema,priceChangeTrendsSubSchema, holdSubSchema};