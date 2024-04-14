const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const { CalendarImplementation, calendarImplementationSubSchema, photoSubSchema,  } = require('./modelUtils/subSchemas.js');
const { calculateDaysBetweenDates, adjustDays, formatDate_Mon_DD_YYYY} = require('./modelUtils/utilityFunctions');
const Guest = require('./guestModel.js');
const PriceChangeTrend = require('./priceChangeTrendModel.js');
const {isThisOfferInEffectOnThisDate, Offer} = require('./offerModel.js');
const axios = require('axios');
const catchAsync = require('../apiUtils/catchAsync.js');

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
    guestID: mongoose.Schema.Types.ObjectId,
    earlyCheckOut: mongoose.Schema.Types.ObjectId // reservationID timed event
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

// const holdSubSchema = new mongoose.Schema({
//     holdID: {
//         type: String,
//         required: [true, 'must have a hold ID'],
//     },
//     sessionID: {
//         type: String,
//         required: [true, 'must have a session ID'],
//     },
//     guestID: mongoose.Schema.Types.ObjectId,
//     holdStartDateTime: {
//         type: Date,
//         required: [true, 'must have a hold time'],
//         // default:new Date()
//     },
//     room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'rooms' },
//     offer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'offers' },
//     created_at: { type: Date, default: Date.now },
//     expires_at: { type: Date, expires: 60 } // 900 seconds -> 15 minutes
// });

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
    // hold: {
    //     type: [holdSubSchema],
    //     required:  [true, 'A room must have a list of holds']
    // },
    miscInfo: miscInfo
});

async function computePriceBasedOnTrend(basePrice, suppliedPriceChangeVal, suppliedPriceChangeType){
    let returnValue = 0;
    const pchangeval = suppliedPriceChangeVal ? parseFloat(suppliedPriceChangeVal.toString()) : parseFloat(this.priceChangeValue.toString())
    const priceChangeType = suppliedPriceChangeType ? suppliedPriceChangeType : this.priceChangeType;
    switch(priceChangeType){
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

async function getPriceOfRoomBasedOnApplicableTrends(date, suppliedTrendArr, suppliedBasePrice){
    const checkedDate = date ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const priceChangeTrends = suppliedTrendArr ?? this.priceChangeTrends;
    const basePrice = suppliedBasePrice ? parseFloat(suppliedBasePrice.toString()) : parseFloat(this.basePrice.toString());
    const applicableRoomTrends = await Promise.all(
        priceChangeTrends.map(async (trend)=>{
            const {priceChangeCalendarImplementation, priceChangeType, priceChangeValue} = trend;
            const {dateType, dateTypeValue, frequencyType,  frequencyPeriodStart, frequencyValue, frequencyPeriodEnd } = priceChangeCalendarImplementation;
            if(await CalendarImplementation.isCurrentDateWithinCalendarImplementation(
            // if(await trend.priceChangeCalendarImplementation.isCurrentDateWithinCalendarImplementation(
                dateType, 
                dateTypeValue,  
                frequencyType, 
                frequencyPeriodStart,  
                frequencyValue,  
                frequencyPeriodEnd, 
                // null, 
                // null, 
                // null, 
                // null, 
                // null, 
                // null, 
                checkedDate
            )){
                // return await trend.computePriceBasedOnTrend(basePrice);
                return await computePriceBasedOnTrend(basePrice, priceChangeValue, priceChangeType);
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


roomSchema.methods.getPriceOfRoomBasedOnApplicableTrends = getPriceOfRoomBasedOnApplicableTrends;
priceChangeTrendsSubSchema.methods.computePriceBasedOnTrend = computePriceBasedOnTrend;


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

// re-written since aggregate only returns JSON and not mongoose object

const getSurcharge = function(basePrice, offerSurcharge){
    let surcharge = 0;

    if(offerSurcharge != null){
        const pchangeval = parseFloat(offerSurcharge.chargeValue.toString())
        switch(offerSurcharge.chargeType){
            case "flatRate":
                surcharge = pchangeval;
            break;
            case "percent":
                surcharge = pchangeval*basePrice;
            break;
        }
    }

    return surcharge;
}

// checks if url is ok, if not returns null
const formatPhotoObj = async (photoObj) => {
    const {url, fileType, altDescription} = photoObj;

    const photoURL = `${process.env.AWS_ROOM_TYPE_IMAGE_URL}${url}.${fileType}`;
    // console.log('======================================')
    // console.log(photoURL)
    try {
        return axios.head(photoURL)
        .then(response => {
          if (response.status === 200) {
            return {
                photoUrl:  photoURL,
                alt: altDescription
            }
          } else {
            // console.log(`roomModel 450: 404 not found${photoURL}`)
            return null;
          }
        })
        .catch(error => {
            // console.log(`roomModel 455: ${error}`)
            return null;
        });
    } catch (err) {
        // console.log(`roomModel 459: ${err}`)
    }
}

roomSchema.statics.getCheckoutBookingData =  async function(offer_id, room_id, checkin, checkout, numberOfGuests, numberOfRooms, guestID){

    const thisDate = checkin ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const thisCheckout = checkout ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    if(!checkout){
        thisCheckout.setDate(thisCheckout.getDate()+1);
    }
    thisDate.setHours(0,0,0,0);
    thisCheckout.setHours(0,0,0,0);
    // console.log(checkin)
    // console.log(checkout)
    let bookingData = {
        roomType: "Room Type",
        offers:["Amenity 1","Amenity 2", "Amenity 3", "Amenity 4", "Amenity 5", "Amenity 6"],
        bedType: "Queen",
        bedCount: 1,
        amenities: [
            {name: "Bathroom", count: 1},
            {name: "Balcony", count: 1}
        ],
        // thumbnailSmall: process.env.AWS_ROOM_TYPE_IMAGE_URL+"72196c538bc4a23a5e92938ea047bc3e00a2fbc7ac4f458e0e7f121c7f112a26",
        thumbnailSmall: null,
        fileType: "jpg",
        checkOut: "Jan 28, 2024",
        checkIn: "Jan 28, 2024",
        guests: 3,
        rate:250,
        totalNights: 2,
        extraPersonFee: 4.71,
        discounts : []
    }

    try {
        // Get Room
        const room = await Room.findOne({
            '_id': new mongoose.Types.ObjectId(room_id), 
            'offers.offerReferenceID': new mongoose.Types.ObjectId(offer_id)
        }).exec();

        if (!room) {
            console.log('No room found with the specified room ID and offer ID');
            return null;
        }
        console.log(room)

        // TODO Get Cx Loyalty Points
        const {roomType, baseAmenities, offers, bedType, bedCount, thumbNail, miscInfo, basePrice, priceChangeTrends} = room;

        const {addedAmenities, offerSurcharge} = offers[0];
        const {small} = thumbNail;
        const {extraPersonFee} = miscInfo;
        const offeredAmenities = [];
        const featuredAmenities = [];

        if(addedAmenities){
            await Promise.all(
                addedAmenities.map(amenityObj=>{
                    offeredAmenities.push(amenityObj.name);
                })
            )
        }

        const extractedOfferedAmenities = baseAmenities.filter(el=>el.category  === 'Offered Amenities');
        const extractedRoomFeatureAmenities = baseAmenities.filter(el=>el.category  === 'Room Features');

        if(extractedOfferedAmenities.length > 0){
            await Promise.all(
                extractedOfferedAmenities.map(amenityObj=>{
                    offeredAmenities.push(amenityObj.name);
                })
            )
        }

        const showerOrBathroom = extractedRoomFeatureAmenities.filter(el=>(el.name  === 'Shower' || el.name  === 'Bathtub'));
        const otherRoomFeaturesAmenities = extractedRoomFeatureAmenities.filter(el=>(el.name  !== 'Shower' && el.name  !== 'Bathtub'));

        if(showerOrBathroom.length > 0){
            await Promise.all(
                showerOrBathroom.map(amenityObj=>{
                    featuredAmenities.push({name: amenityObj.name, count: amenityObj?.quantity??1});
                })
            )
        }

        if(otherRoomFeaturesAmenities.length > 0){
            await Promise.all(
                otherRoomFeaturesAmenities.map(amenityObj=>{
                    featuredAmenities.push({name: amenityObj.name, count: amenityObj?.quantity??1});
                })
            )
        }
        console.log(baseAmenities)
        bookingData.roomType = roomType;
        bookingData.offers = offeredAmenities;
        bookingData.bedType = bedType;
        bookingData.bedCount = bedCount;
        bookingData.amenities = featuredAmenities;
        bookingData.thumbnailSmall = `${process.env.AWS_ROOM_TYPE_IMAGE_URL}${small.url}`;
        bookingData.fileType = small.fileType;
        bookingData.checkOut = formatDate_Mon_DD_YYYY(thisDate);
        bookingData.checkIn = formatDate_Mon_DD_YYYY(thisCheckout);
        bookingData.guests = numberOfGuests;
        bookingData.rate = await getAverageRoomPrice(thisDate, thisCheckout, basePrice, offerSurcharge, priceChangeTrends);
        bookingData.totalNights = calculateDaysBetweenDates(thisDate,thisCheckout);
        bookingData.extraPersonFee = (extraPersonFee*numberOfGuests).toFixed(2);
        bookingData.discounts = [];
    } catch (error) {
        console.error('Error finding the room:', error);
        return null;
    }

    return bookingData;

}

async function getAverageRoomPrice(date, checkoutDate, basePrice, offerSurcharge, priceChangeTrends) {
    // Get the computed average price of room per day, then average
    const surcharge =  await getSurcharge(basePrice, offerSurcharge);
    const totalDays = calculateDaysBetweenDates(date, checkoutDate);
    const pricePerDay = await Promise.all(
        [...Array(totalDays)].map(async (blank, index) =>{
            try {
                return await getPriceOfRoomBasedOnApplicableTrends(adjustDays(date, index), priceChangeTrends, basePrice);
            } catch (err) {
                console.log(err)
                return 0
            }
        })
    )
    const averagePrice = pricePerDay.reduce(function (sum, value) {
        return sum + value;
    }, 0) / pricePerDay.length;

    const avePricePlusSurchargeaveragePrice = averagePrice + surcharge;
    return avePricePlusSurchargeaveragePrice.toFixed(2);
}

roomSchema.statics.getOffer =  async function(roomOffer, date, checkoutDate){
    const thisDate = date ?? calendarImplementationSubSchema.statics.TODAYS_DATE();

    const thisCheckout = checkoutDate ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    if(!checkoutDate){
        thisCheckout.setDate(thisCheckout.getDate()+1);
    }

    const {basePrice, offer, thumbNail, baseAmenities, roomType, priceChangeTrends} = roomOffer;

    const {offerCalendarImplementation, description, name, offerReferenceID} = offer;

    const {dateType, dateTypeValue, frequencyType, frequencyValue, frequencyPeriodStart, frequencyPeriodEnd} = offerCalendarImplementation


    // console.log(JSON.stringify(roomOffer, null, '\t'))


    roomOffer.isValid = await CalendarImplementation.isCurrentDateWithinCalendarImplementation(
        dateType, 
        dateTypeValue, 
        frequencyType, 
        frequencyPeriodStart, 
        frequencyValue, 
        frequencyPeriodEnd,
        thisDate
    );
    

    if(roomOffer.isValid === true || roomOffer.isValid === "true"){
        const {large, small} = thumbNail;
        roomOffer.offerID = offerReferenceID
        roomOffer.surcharge = await getSurcharge(basePrice, offer.offerSurcharge);
        roomOffer.thumbNailLarge = await formatPhotoObj(large);
        roomOffer.thumbNailSmall = await formatPhotoObj(small);
        roomOffer.offerDescription = description;
        if((baseAmenities.filter(el=>el.name==="Bathtub")).length > 0){
            roomOffer.hasBath = true;
        } 
        if(!name.includes("Standard Offer") ){
            roomOffer.offerName = name;
        }
        delete roomOffer.thumbNail;

        // Get the computed average price of room per day, then average
        const totalDays = calculateDaysBetweenDates(date, checkoutDate);
        const pricePerDay = await Promise.all(
            [...Array(totalDays)].map(async (blank, index) =>{
                try {
                    return await getPriceOfRoomBasedOnApplicableTrends(adjustDays(date, index), priceChangeTrends, basePrice);
                } catch (err) {
                    console.log(err)
                    return 0
                }
            })
        )
        const averagePrice = pricePerDay.reduce(function (sum, value) {
            return sum + value;
        }, 0) / pricePerDay.length;

        const avePricePlusSurchargeaveragePrice = averagePrice + roomOffer.surcharge;
        roomOffer.averagePricePerNight = avePricePlusSurchargeaveragePrice.toFixed(2);

        return new Promise((res)=>{
            res(roomOffer)
        });

    } else {
        return new Promise((res)=>{
            res(null)
        })
    }

}

const Room = mongoose.model('room', roomSchema);

module.exports = {Room, photoSubSchema, amenitySubSchema, promotionsRoomSubSchema, offersRoomSubSchema, offerSurchargeRoomSubSchema,priceChangeTrendsSubSchema};