const express = require('express');
var app = express();
const {getAllEmployees, getEmployeeById} = require('./../controllers/employeeController.js');
const authController = require('./../controllers/authController.js');
const employeeRouter = express.Router();


employeeRouter.post('/login', authController.loginEmployee);

employeeRouter
  .route('/')
  .get(getAllEmployees);

employeeRouter
.route('/:id')
.get(getEmployeeById);

module.exports = employeeRouter;