const mongoose = require('mongoose');
const Guest = require('../models/guestModel.js');
const {Types} = mongoose;

exports.getAllGuests = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getAllGuests route is not yet defined!'
    });
}

exports.getGuestById = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getGuestById route is not yet defined!'
    });
}