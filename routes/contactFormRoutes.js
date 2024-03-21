const express = require('express');
var app = express();
const {getAllUnregisteredContactForms, getUnregisteredContactFormsById, submitContactForm} = require('./../controllers/contactFormController.js');
const contactFormRouter = express.Router();

contactFormRouter
  .route('/')
  .get(getAllUnregisteredContactForms)
  
  contactFormRouter
  .route('/:id')
  .get(getUnregisteredContactFormsById);

  contactFormRouter
  .route('/submit')
  .get(submitContactForm)

module.exports = contactFormRouter;