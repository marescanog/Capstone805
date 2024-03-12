const mongoose = require('mongoose');


const replySubSchema = new mongoose.Schema({
    messageBody: {
        type: String,
        required: [true, 'must have a message body'],
    },
    createdOn: {
        type: Date,
        required: [true, 'must have a date it was created on']
    },
    isOpened: {
        type: Boolean,
        required: [true, 'must have a flag'],
    },
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'must have an object id'],
    },
    firstName: {
        type: String,
        required: [true, 'must have a string']
    },
    lastName: {
        type: String,
        required: [true, 'must have a string'],
    }
});


const contactFormSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: [true, 'must have an email address']
    },
    firstName: {
        type: String,
        required: [true, 'must have a first name']
    },
    lastName: {
        type: String,
        required: [true, 'must have a last name']
    },
    mobileNumber: String,
    title: {
        type: String,
        required: [true, 'must have a title'],
    },
    messageBody: {
        type: String,
        required: [true, 'must have a message body']
    },
    reply: replySubSchema,
    createdOn: {
        type: Date,
        required: [true, 'must have a date object was created on']
    }
});

const ContactForm = mongoose.model('unregisteredformsubmissions', contactFormSchema);

module.exports = ContactForm;