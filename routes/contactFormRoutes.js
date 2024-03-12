const express = require('express');
var app = express();
const {getAllUnregisteredContactForms, getUnregisteredContactFormsById} = require('./../controllers/contactFormController.js');
const contactFormRouter = express.Router();

contactFormRouter
  .route('/')
  .get(getAllUnregisteredContactForms);

  contactFormRouter
  .route('/:id')
  .get(getUnregisteredContactFormsById);

module.exports = contactFormRouter;