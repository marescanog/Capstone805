const mongoose = require('mongoose');
const ContactForm = require('../models/contactFormModel.js');
const {Types} = mongoose;

exports.getAllUnregisteredContactForms = async (req, res) => {
    try {
        
        const unregisteredForms = await ContactForm.find({});

     if (!unregisteredForms || unregisteredForms.length === 0) {
            return res.status(404).json({
                status: 'not found',
                message: 'No unregistered contact forms found.'
            });
        }

        res.status(200).json(unregisteredForms);
   }catch(err){
    res.status(500).json({
        status: 'error',
        message: 'The getAllUnregisteredContactForms route is not yet defined!'
    });
   }
}
exports.getUnregisteredContactFormsById = async (req, res) => {
    try{
        const result = await ContactForm.find({_id: req.params.id});
        res.json(result);
    } catch(err) {
        res.status(500).json({
            status: 'error',
            message: 'The getUnregisteredContactFormsById route is not yet defined!'
        });
    }
}


exports.submitContactForm = async (req, res) => {
    try {
        // Create a new contact form document using the model and request body data
        const newContactForm = await ContactForm.create({
            emailAddress: req.body.emailAddress,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNumber: req.body.mobileNumber, // This is optional in your model
            title: req.body.title,
            messageBody: req.body.messageBody,
            createdOn: new Date(), // Automatically set the createdOn date to now
            // reply field will be added or updated when there's a reply to the form
        });

        // Respond with a success message and the saved document
        res.status(201).json({
            status: 'success',
            data: {
                contactForm: newContactForm
            }
        });
    } catch (err) {
        // Handle possible errors, such as validation errors or database connection issues
        res.status(500).json({
            status: 'error',
            message: 'Failed to submit contact form. ' + err.message
        });
    }
};
