const express = require('express');
const authController = require('./../controllers/authController');
var app = express();
const {routeCheckout, routeCreateAccountPost, renderCreateAccountPage, renderVerifyPage, 
  staffRenderCreateReservationPage} = require('./../controllers/checkoutController.js');
const checkoutRouter = express.Router();
const staffRouter = express.Router();

checkoutRouter
  .route('/')
  .get(  authController.detect, authController.createCheckoutSession, authController.cacheControl,  routeCheckout);

checkoutRouter
.route('/createAccount')
.get(authController.detect, authController.cacheControl,  renderCreateAccountPage)
.post(authController.detect, authController.cacheControl,  routeCreateAccountPost);

checkoutRouter
.route('/verifyaccount')
.get(authController.detect, authController.cacheControl,  renderVerifyPage);

// // move to dashboard instea of checkout router
// checkoutRouter
// .route('/reservationinfo/:id')
// .get(renderReservationInfoPage); 

// TODO LOGIN AT CHECKOUT
checkoutRouter
  .route('/api/v1/guests/login')
  .post((req,res,next)=>{
    return res.status(500).json({message:"/api/v1/guests/login has not been defined yet"})
  })


checkoutRouter.use('/staff', staffRouter);
staffRouter.route('/create').get(authController.detect, authController.cacheControl,  staffRenderCreateReservationPage);

// staffRouter.route('/view/:id').get(renderReservationInfoPage); // // move to dashboard instea of checkout router



module.exports = checkoutRouter;