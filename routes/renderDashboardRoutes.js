const express = require('express');
const {loadStaffDashboard, editStaffAccount, editStaffPassword, updateStaffPhoto, createReservations, viewStaffReservations, viewInquiries, checkin, viewSingleReservationStafPOV } = require('./../controllers/dashboard/staffDashboardController.js');
const {loadManagerDashboard, viewOffers, viewPromotions, viewRooms} = require('./../controllers/dashboard/managerDashboardController.js');
const {loadAdminDashboard, viewUsers } = require('./../controllers/dashboard/adminDashboardController.js');
const {loadUserDashboard, uploadNewGuestPhotoPage, updateGuestEmailPage, updateGuestPasswordPage, 
    editGuestProfilePage, loyaltyPointsHistoryPage, reservationHistoryPage, viewInboxPage, renderGuestReservationInfoPage} = require('./../controllers/dashboard/dashboardController.js'); 
const authController = require('./../controllers/authController.js');

const renderDashboardRouter = express.Router();
const staffRouter = express.Router();
const managerRouter = express.Router();
const adminRouter = express.Router();
const userRouter = express.Router();

// Staff Router
renderDashboardRouter.use('/staff', staffRouter);
// Staff Routes
staffRouter.route('/viewReservations').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), viewStaffReservations); //done
staffRouter.route('/edit').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), editStaffAccount); //done
staffRouter.route('/changePassword').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), editStaffPassword); //done
staffRouter.route('/updatePhoto').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), updateStaffPhoto); //done
staffRouter.route('/createReservations').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), createReservations); //semi-done rushed html & css
staffRouter.route('/inquiries').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), viewInquiries); //semi-done rushed html & css
staffRouter.route('/checkin').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), checkin); //done - no modal
staffRouter.route('/reservation/:id').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff', 'manager', 'admin'), viewSingleReservationStafPOV); //done - modify for staff pov
staffRouter.route('/:id').get(authController.protect, authController.verifyEmployee, authController.restrictTo('staff'), loadStaffDashboard); //done



// Manager Router
renderDashboardRouter.use('/manager', managerRouter);
// Manager Routes
// // Manager Routes
// managerRouter.route('/viewReservations').get(viewStaffReservations);
// managerRouter.route('/edit').get(editStaffAccount);
// managerRouter.route('/changePassword').get(editStaffPassword);
// managerRouter.route('/updatePhoto').get(updateStaffPhoto);
// managerRouter.route('/createReservations').get(createReservations);
// managerRouter.route('/inquiries').get(viewInquiries);
// managerRouter.route('/checkin').get(checkin);
managerRouter.route('/offers').get(viewOffers);
managerRouter.route('/promotions').get(viewPromotions);
managerRouter.route('/rooms').get(viewRooms);
managerRouter.route('/:id').get(loadManagerDashboard);
// generate repor
// create edit room
// create edit offer
// create edit promotions


// Admin Router
renderDashboardRouter.use('/USNVMQD493', adminRouter);
// adminRouter.route('/viewReservations').get(viewStaffReservations);
// adminRouter.route('/edit').get(editStaffAccount);
// adminRouter.route('/changePassword').get(editStaffPassword);
// adminRouter.route('/updatePhoto').get(updateStaffPhoto);
// adminRouter.route('/createReservations').get(createReservations);
// adminRouter.route('/inquiries').get(viewInquiries);
// adminRouter.route('/checkin').get(checkin);
// adminRouter.route('/offers').get(checkin);
// adminRouter.route('/promotions').get(checkin);
// adminRouter.route('/rooms').get(checkin);
adminRouter.route('/users').get(viewUsers);
adminRouter.route('/:id').get(loadAdminDashboard);
// create user
// manage user permissions8

// Guest Router
renderDashboardRouter.use('/guest', userRouter);
// authController.restrictTo('guest')
userRouter.route("/update-email").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), updateGuestEmailPage);
userRouter.route("/upload-photo").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), uploadNewGuestPhotoPage);
userRouter.route("/update-password").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), updateGuestPasswordPage);
userRouter.route("/editacccount").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), editGuestProfilePage);
userRouter.route("/loyalty-history").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), loyaltyPointsHistoryPage);
userRouter.route("/reservations").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), reservationHistoryPage);
userRouter.route("/view-inbox").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), viewInboxPage);
userRouter.route("/reservationinfo/:id").get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), renderGuestReservationInfoPage);
userRouter.route('/:id').get(authController.protect, authController.verifyGuest, authController.restrictTo('guest'), loadUserDashboard);
// ,
module.exports = renderDashboardRouter;