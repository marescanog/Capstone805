const express = require('express');
var app = express();
const {routeCheckout, renderCreateAccountPage, renderVerifyPage, renderGuestInformationPage} = require('./../controllers/checkoutController.js');
const checkoutRouter = express.Router();

checkoutRouter
  .route('/')
  .get(routeCheckout);

checkoutRouter
.route('/createAccount')
.get(renderCreateAccountPage);

checkoutRouter
.route('/verify')
.get(renderVerifyPage);

checkoutRouter
.route('/guestInfomation')
.get(renderGuestInformationPage);

module.exports = checkoutRouter;