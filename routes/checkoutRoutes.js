const express = require('express');
var app = express();
const {routeCheckout, routeCreateAccountPost, renderCreateAccountPage, renderVerifyPage, 
  staffRenderCreateReservationPage, staffCreateReservation} = require('./../controllers/checkoutController.js');
const checkoutRouter = express.Router();
const staffRouter = express.Router();

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

// // move to dashboard instea of checkout router
// checkoutRouter
// .route('/reservationinfo/:id')
// .get(renderReservationInfoPage); 


checkoutRouter.use('/staff', staffRouter);
staffRouter.route('/create').get(staffRenderCreateReservationPage);

// staffRouter.route('/view/:id').get(renderReservationInfoPage); // // move to dashboard instea of checkout router



module.exports = checkoutRouter;