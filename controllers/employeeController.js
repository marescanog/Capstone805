const mongoose = require('mongoose');
const Employee = require('../models/employeeModel.js');
const {Types} = mongoose;


exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({
            status: 'success',
            data: {
                employees
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById({ _id: req.params.id });

        if (!employee) {
            return res.status(404).json({
                status: 'error',
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                employee
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};
