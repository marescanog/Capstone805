const express = require('express');
var app = express();
const {routeCheckout, routeCreateAccountPost, renderCreateAccountPage, renderVerifyPage, renderGuestInformationPage} = require('./../controllers/checkoutController.js');
const checkoutRouter = express.Router();

checkoutRouter
  .route('/')
  .get(routeCheckout);

checkoutRouter
.route('/createAccount')
.get(renderCreateAccountPage)
.post(routeCreateAccountPost);

checkoutRouter
.route('/verifyaccount')
.get(renderVerifyPage);

checkoutRouter
.route('/guestInfomation')
.get(renderGuestInformationPage);


module.exports = checkoutRouter;