const express = require('express');
var app = express();
const {getAllGuests, getGuestById, patchGuestAccountInfo} = require('./../controllers/guestController.js');
const guestRouter = express.Router();

guestRouter
  .route('/')
  .get(getAllGuests);

guestRouter
  .route('/:id')
  .get(getGuestById)
  .patch(patchGuestAccountInfo)

module.exports = guestRouter;