const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;

const calendarImplementationSubSchema = new mongoose.Schema({
    dateType: {
        type: String,
        required: [true, 'must have a type Of Value'],
        enum: {
            values: ['season','month', 'weekNumber','dayOfWeek','dayOfMonth'],
            message: "must be part of categories"
        }
    },
    dateTypeValue: {
        type: [Number],
        required: [true, 'must have a value'],
    },
    frequencyType: {
        type: String,
        required: [true, 'must have a frequency'],
        enum: {
            values: ['once','repeats indefinately','repeats for fixed date period'],
            message: "must be part of categories"
        }
    },
    frequencyValue: [Number],
    frequencyPeriodStart: {
        type: Date,
        required: [true, 'must have a start date'],
    },
    frequencyPeriodEnd: Date
});

const addressSubSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, 'must have a address']
    },
    city: {
        type: String,
        required: [true, 'must have a city']
    },
    postalCode: {
        type: String,
        required: [true, 'must have a postalCode']
    },
    country: {
        type: String,
        required: [true, 'must have a country']
    },
});

const photoSubSchema = new mongoose.Schema({
    uploadDate: {
        type: Date,
        required: [true, 'A photo must have a name'],
        default: new Date()
    },
    fileType: {
        type: String,
        required: [true, 'A photo must have a url'],
    },
    url: {
        type: String,
        required: [true, 'A photo must have a url'],
    },
    altDescription: {
        type: String,
        required:  [true, 'A photo must have an altDescription'],
        default: "hotelCalifornia image"
    }
});


// ======================
//      FUNCTIONS
//=======================
calendarImplementationSubSchema.statics.TODAYS_DATE  = () => {
    return new Date(2024,3,3);
}

// Returns the whole season constants object, where each start and end date range can be accessed by season name
calendarImplementationSubSchema.statics.SEASON_CONSTANTS  = () => {
    const today = calendarImplementationSubSchema.statics.TODAYS_DATE();
    return {
        winter: {
            startDate: today.getMonth() === 11 ? new Date(today.getFullYear(), 11, 1) :  new Date(today.getFullYear()-1, 11, 1),
            endDate: today.getMonth() === 11 ? new Date(today.getFullYear()+1, 2, 0) :  new Date(today.getFullYear(), 2, 0)
        },
        spring: {
            startDate: new Date(today.getFullYear(), 2, 1),
            endDate: new Date(today.getFullYear(), 5, 0)
        },
        summer: {
            startDate: new Date(today.getFullYear(), 5, 1),
            endDate: new Date(today.getFullYear(), 8, 0)
        },
        fall: {
            startDate: new Date(today.getFullYear(), 8, 1),
            endDate: fallEndDate = new Date(today.getFullYear(), 11, 0)
        }
    }
}

calendarImplementationSubSchema.statics.isCurrentDateWithinSeasonRange  = async (seasonNumber) => {
    const today = calendarImplementationSubSchema.statics.TODAYS_DATE();
    switch(seasonNumber){
        case 1:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().winter.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().winter.endDate
            );
            break;
        case 2:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().spring.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().spring.endDate
            );
            break;
        case 3:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().summer.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().summer.endDate
            );
            break;
        case 4:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().fall.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS().fall.endDate
            );
            break;
    }
    return false;
}

calendarImplementationSubSchema.statics.isDateWithinArrayOfSeasons  = async (arr) => {
    const newArr = await Promise.all(
        arr.map(async (seasonNumber)=>{
            return await calendarImplementationSubSchema.statics.isCurrentDateWithinSeasonRange(seasonNumber);
        })
    )
    return new Promise((resolve)=>{
        resolve(newArr.includes(true))
    });
}

calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate  = async (dateToCompare, startDate, endDate) => {
    try{
        return await dateToCompare.getTime() >= startDate.getTime() && dateToCompare.getTime() <= endDate.getTime() 
    } catch {
        return false;
    }
};

// TODOS
//     dateType: dateType,
//     dateTypeValue: dateTypeValue,
//     frequencyType: frequencyType,
//     frequencyPeriodStart: frequencyPeriodStart, 
//     frequencyValue: frequencyValue, 
//     frequencyPeriodEnd: frequencyPeriodEnd
calendarImplementationSubSchema.statics.isCurrentDateWithinCalendarImplementation = async function(dateType, dateTypeValue, frequencyType, frequencyPeriodStart, frequencyValue = null, frequencyPeriodEnd = null){
    const today = calendarImplementationSubSchema.statics.TODAYS_DATE();
    switch(dateType){
        case "season":
            /*
                Winter: December 1 to February 28/29(leap year)
                Spring: March 1 to May 31
                Summer: June 1 to August 31
                Fall: September 1 to November 30
                ------------------------------------------------
                Starting Value is Winter at 1
                Ending value is Fall at 4
            */
           if(Array.isArray(dateTypeValue) && dateTypeValue.length > 0){
                return await calendarImplementationSubSchema.statics.isDateWithinArrayOfSeasons(dateTypeValue)
           }
           return false;
            break;
        case "month":
            // text = 'month';
            break;
        case "weekNumber":
            // text = 'weekNumber';
            break;
        case "dayOfWeek":
            /*
                Based on getDay() if date 
                Sunday = 0, Monday = 1, ... Saturday = 6
            */
            // TODO: frequencyValue is an Array of frequencies (aplicable months for the weeks defined)
            if(Array.isArray(dateTypeValue) && dateTypeValue.length > 0 &&  dateTypeValue.includes(today.getDay())){
                return dateTypeValue;
            }
            return false;
            break;
        case "dayOfMonth":
            // text = 'dayOfMonth';
            break;
    }
    return false;
};

const CalendarImplementation = mongoose.model('calendarimplementations', calendarImplementationSubSchema);

// compile schemas
module.exports = {CalendarImplementation, calendarImplementationSubSchema, addressSubSchema, photoSubSchema};