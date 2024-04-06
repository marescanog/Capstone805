const express = require('express');
var app = express();
const {getAllEmployees, getEmployeeById} = require('./../controllers/employeeController.js');
const authController = require('./../controllers/authController.js');
const employeeRouter = express.Router();


employeeRouter.post('/login', authController.loginEmployee);
employeeRouter.post('/managementLogin', authController.loginManagement);
employeeRouter.post('/forgotPassword', authController.forgotPasswordEmployee);
employeeRouter.patch('/resetPassword/:token', authController.resetPasswordEmployee);

employeeRouter
  .route('/')
  .get(getAllEmployees);

employeeRouter
.route('/:id')
.get(getEmployeeById);

module.exports = employeeRouter;