const mongoose = require('mongoose');
const {Decimal128} = mongoose.Types;
const { calendarImplementationSubSchema, addressSubSchema, photoSubSchema } = require('./modelUtils/subSchemas.js');


const partnerDetailsSubschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name']
    },
    address: {
        type: addressSubSchema,
        required: [true, 'must have a name']
    },
    details: String,
    photoUrl: photoSubSchema
});

const promotionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have a name and must be unique'],
        unique: true
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
    partnerDetails: partnerDetailsSubschema,
    createdOn: {
        type: Date,
        required: [true, 'must have a date it was created on'],
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have a the id of the one who created it'],
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

const Promotion = mongoose.model('promotion', promotionsSchema);

module.exports = Promotion;