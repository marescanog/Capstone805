const express = require('express');
var app = express();
const {getAllGuests, getGuestById, patchGuestAccountInfo} = require('./../controllers/guestController.js');
const {signup} = require('./../controllers/authController.js');
const guestRouter = express.Router();

guestRouter
  .route('/')
  .get(getAllGuests)
  .post(signup);

guestRouter
  .route('/:id')
  .get(getGuestById)
  .patch(patchGuestAccountInfo)

module.exports = guestRouter;