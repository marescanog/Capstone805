const express = require('express');
const {getAllGuests, registerGuest, getGuest, updateGuest} = require('./../controllers/guestController.js');
const guestRouter = express.Router();

guestRouter
  .route('/')
  .get(getAllGuests)
  .post(registerGuest);

guestRouter
  .route('/:id')
  .get(getGuest)
  .patch(updateGuest);

  module.exports = guestRouter;