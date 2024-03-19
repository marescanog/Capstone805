const mongoose = require('mongoose');
const ContactForm = require('../models/contactFormModel.js');
const {Types} = mongoose;

exports.getAllUnregisteredContactForms = async (req, res) => {
    try {
        
        const unregisteredForms = await ContactForm.find({ isRegistered: false });

     if (!unregisteredForms || unregisteredForms.length === 0) {
            return res.status(404).json({
                status: 'not found',
                message: 'No unregistered contact forms found.'
            });
        }

        res.json({
            status: 'success',
            data: unregisteredForms
        });
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