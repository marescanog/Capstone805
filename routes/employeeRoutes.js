const express = require('express');
var app = express();
const {getAllEmployees, getEmployeeById} = require('./../controllers/employeeController.js');
const employeeRouter = express.Router();

employeeRouter
  .route('/')
  .get(getAllEmployees);

  employeeRouter
  .route('/:id')
  .get(getEmployeeById);

module.exports = employeeRouter;