const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const {getRandomInt, adjustDays, compareDates} = require('./utilityFunctions.js');

const calendarImplementationSubSchema = new mongoose.Schema({
    dateType: {
        type: String,
        required: [true, 'must have a type Of Value'],
        enum: {
            values: ['season','month', 'dayOfWeek','dayOfMonth'], // exckuded weekNumber
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

calendarImplementationSubSchema.statics.TOMORROWS_DATE  = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate()+1);
    return today;
}

// Returns the whole season constants object, where each start and end date range can be accessed by season name
// Season constants is dynamic based on current year (esp feb where there is leap year)
calendarImplementationSubSchema.statics.SEASON_CONSTANTS  = (compareDate) => {
    const today = compareDate ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
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
            endDate: new Date(today.getFullYear(), 11, 0)
        }
    }
}

calendarImplementationSubSchema.statics.isCurrentDateWithinSeasonRange  = async (seasonNumber, compareDate) => {
    const today = compareDate ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    // const today = calendarImplementationSubSchema.statics.TODAYS_DATE();
    switch(seasonNumber){
        case 1:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).winter.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).winter.endDate
            );
            break;
        case 2:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).spring.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).spring.endDate
            );
            break;
        case 3:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).summer.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).summer.endDate
            );
            break;
        case 4:
            return await calendarImplementationSubSchema.statics.isDateBewteenStartDateAndEndDate(
                    today,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).fall.startDate,
                    calendarImplementationSubSchema.statics.SEASON_CONSTANTS(today).fall.endDate
            );
            break;
    }
    return false;
}

calendarImplementationSubSchema.statics.isDateWithinArrayOfSeasons  = async (arr, compareDate) => {
    const today = compareDate ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const newArr = await Promise.all(
        arr.map(async (seasonNumber)=>{
            return await calendarImplementationSubSchema.statics.isCurrentDateWithinSeasonRange(seasonNumber, today);
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


async function checkIfDateisWithinCalendarImplementation(
    dateType, 
    dateTypeValue, 
    frequencyType, 
    frequencyPeriodStart, 
    frequencyValue = null, 
    frequencyPeriodEnd = null,
    dateToCompare = null
){
    const today = dateToCompare ?? calendarImplementationSubSchema.statics.TODAYS_DATE();
    const this_dateType = dateType ?? this.dateType;
    const this_dateTypeValue = dateTypeValue ?? this.dateTypeValue;
    const this_frequencyType = frequencyType ?? this.frequencyType;
    const this_frequencyPeriodStart = frequencyPeriodStart ?? this.frequencyPeriodStart;
    const this_frequencyValue = frequencyValue ?? this.frequencyValue;
    const this_frequencyPeriodEnd = frequencyPeriodEnd ?? this.frequencyPeriodEnd;

    let retval = false

    if(compareDates(today, this_frequencyPeriodStart) >= 0){
        switch(this_dateType){
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
                if(Array.isArray(this_dateTypeValue) && this_dateTypeValue.length > 0){
                    retval = await calendarImplementationSubSchema.statics.isDateWithinArrayOfSeasons(this_dateTypeValue, today)
                }
                break;
            case "month":
                // whole month implemented, frequency is year?->or no option to choose frequency ofr year & month
                if(Array.isArray(this_dateTypeValue) && this_dateTypeValue.length > 0 &&  this_dateTypeValue.includes(today.getMonth())){
                    return true;
                }
                break;
            /*
                // case "weekNumber": // cut this feature out, no time
                // text = 'weekNumber';
                // break;
                // if you want whole week, you can either do 'once', then all days of the week
                // or 'dayOfMonth' and select days for that week
            */
            case "dayOfWeek":
                /*
                    Based on getDay() if date 
                    Sunday = 0, Monday = 1, ... Saturday = 6,
                    if frequency value is defined [0,1,2] means for months Jan Feb March only 
                */
                if(Array.isArray(this_dateTypeValue) && this_dateTypeValue.length > 0 &&  this_dateTypeValue.includes(today.getDay())){

                    retval = true;

                    if(this_frequencyType == 'once'){
                        // find start week and end week, base it on this_frequencyPeriodStart
                        // this_frequencyPeriodStart until this_frequencyPeriodStart+6
                        // so if the start is March 1, 2024 , then the end is march 7, 2024
                        const endOfWeek = adjustDays(this_frequencyPeriodStart, 6);
                        return compareDates(today, this_frequencyPeriodStart) >= 0 && compareDates (today, endOfWeek) <= 0;
                    } 

                    //today
                    if(retval && this_dateTypeValue != null && Array.isArray(this_dateTypeValue ) && this_dateTypeValue.length != 0){
                        if(!this_dateTypeValue.includes(today.getDay())){
                            retval = false;
                            return false;
                        }
                    }

                    // recheck controls for frequency Value TODO
                    if(retval && this_frequencyValue != null && Array.isArray(this_frequencyValue ) && this_frequencyValue.length != 0){
                        if(!this_frequencyValue.includes(today.getMonth())){
                            retval = false;
                            return false;
                        }
                    }
      
                    if(retval && this_frequencyPeriodEnd != null && this_frequencyType == 'repeats for fixed date period'){
                        retval = false;
                        return !(compareDates(today, this_frequencyPeriodEnd) > 0);
                    } 
                }
                
                break;

            case "dayOfMonth":

                if(Array.isArray(this_dateTypeValue) && this_dateTypeValue.length > 0 &&  this_dateTypeValue.includes(today.getDate())){

                    retval = true;

                    if(this_frequencyType == 'once'){
                        // run only once so based on frequency start year and month
                        // So if Feb 10, 2024 is start and days 14,25,26 are selected
                        // Months March 12, 25 and 26 would be invalid
                        const yearToRun = this_frequencyPeriodStart.getFullYear();
                        const monthToRun = this_frequencyPeriodStart.getMonth();
                        const mappedValues = Promise.all(
                            this_dateTypeValue.map(el=>{
                                const frequencyDate = new Date(yearToRun, monthToRun, el);
                                return compareDates(frequencyDate, today)==0;
                            })
                        );
                        retval = (await mappedValues).includes(true);
                    } 

                    if(retval && this_frequencyValue != null && Array.isArray(this_frequencyValue ) && this_frequencyValue.length != 0){
                        if(!this_frequencyValue.includes(today.getMonth())){
                            retval = false;
                        }
                    }

                    if(retval && this_frequencyPeriodEnd != null && this_frequencyType == 'repeats for fixed date period'){
                        retval = !(compareDates(today, this_frequencyPeriodEnd) > 0);
                    } 

                }

                break;
        }
    } 

    return retval;
};

calendarImplementationSubSchema.statics.isCurrentDateWithinCalendarImplementation = checkIfDateisWithinCalendarImplementation;

calendarImplementationSubSchema.methods.isCurrentDateWithinCalendarImplementation = checkIfDateisWithinCalendarImplementation;


const CalendarImplementation = mongoose.model('calendarimplementations', calendarImplementationSubSchema);

// compile schemas
module.exports = {CalendarImplementation, calendarImplementationSubSchema, addressSubSchema, photoSubSchema};

