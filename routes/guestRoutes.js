const express = require('express');
var app = express();
const {getAllGuests, getGuestById, patchGuestAccountInfo} = require('./../controllers/guestController.js');
const {signup, loginGuest, forgotPasswordGuest, resetPasswordGuest} = require('./../controllers/authController.js');
const guestRouter = express.Router();

guestRouter.post('/login', loginGuest);

guestRouter.post('/forgotPassword', forgotPasswordGuest);
guestRouter.patch('/resetPassword/:token', resetPasswordGuest);

guestRouter
  .route('/')
  .get(getAllGuests)
  .post(signup);

guestRouter
  .route('/:id')
  .get(getGuestById)
  .patch(patchGuestAccountInfo)

module.exports = guestRouter;