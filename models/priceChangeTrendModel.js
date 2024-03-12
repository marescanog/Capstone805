const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const {calendarImplementationSubSchema, CalendarImplementation} = require('./modelUtils/subSchemas.js');
const bcrypt = require('bcryptjs');
const priceChangeTrendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name and must be unique'],
        unique: true
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
    },
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

// dateType: dateType,
// dateTypeValue: dateTypeValue,
// frequencyType: frequencyType,
// frequencyPeriodStart: frequencyPeriodStart, 
// frequencyValue: frequencyValue, 
// frequencyPeriodEnd: frequencyPeriodEnd
// priceChangeTrendSchema.methods.getCurrentPriceTrend = async function(){
//     return  CalendarImplementation.getDateRange(
//         this.priceChangeCalendarImplementation?.dateType,
//         this.priceChangeCalendarImplementation?.dateTypeValue,
//         this.priceChangeCalendarImplementation?.frequencyType,
//         this.priceChangeCalendarImplementation?.frequencyPeriodStart,
//         this.priceChangeCalendarImplementation?.frequencyValue,
//         this.priceChangeCalendarImplementation?.frequencyPeriodEnd
//     )
// }

priceChangeTrendSchema.statics.currentDateFallsWithinSpecifiedTrendRange = async function(trend){
    return await CalendarImplementation.isCurrentDateWithinCalendarImplementation(
        trend?.dateType,
        trend?.dateTypeValue,
        trend?.frequencyType,
        trend?.frequencyPeriodStart,
        trend?.frequencyValue,
        trend?.frequencyPeriodEnd
    )
    // return true;
}


const PriceChangeTrend = mongoose.model('priceChangeTrends', priceChangeTrendSchema);

module.exports = PriceChangeTrend;