const mongoose = require('mongoose');
const Guest = require('../models/guestModel.js');
const {Types} = mongoose;

exports.patchGuestAccountInfo = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The patchGuestAccountInfo route is not yet defined!'
    });
}

exports.getAllGuests = async (req, res) => {
    try {
        // Query the database to fetch all guest records
        const guests = await Guest.find();

        res.status(200).json({
            status: 'success',
            data: {
                guests
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.getGuestById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is a valid ObjectId
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid guest ID'
            });
        }

        // Query the database to fetch the guest user by ID
        const guest = await Guest.findById(id);

        if (!guest) {
            return res.status(404).json({
                status: 'error',
                message: 'Guest user not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                guest
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}