const mongoose = require('mongoose');
const Employee = require('../models/employeeModel.js');
const {Types} = mongoose;

exports.getAllEmployees = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getAllEmployees route is not yet defined!'
    });
}

exports.getEmployeeById = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getEmployeeById route is not yet defined!'
    });
}