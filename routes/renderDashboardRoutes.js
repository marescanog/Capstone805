const express = require('express');
const {loadStaffDashboard, editStaffAccount, editStaffPassword, updateStaffPhoto, createReservations, viewStaffReservations, viewInquiries, checkin, viewSingleReservationStafPOV } = require('./../controllers/dashboard/staffDashboardController.js');
const {loadManagerDashboard, viewOffers, viewPromotions, viewRooms, viewReportPage, viewCreateRoomPage, viewRoomPage, viewCreateOfferPage, viewOfferPage, viewCreatePromotionPage, viewPromotionPage} = require('./../controllers/dashboard/managerDashboardController.js');
const {loadAdminDashboard, viewUsers } = require('./../controllers/dashboard/adminDashboardController.js');
const {loadUserDashboard, uploadNewGuestPhotoPage, updateGuestEmailPage, updateGuestPasswordPage, 
    editGuestProfilePage, loyaltyPointsHistoryPage, reservationHistoryPage, viewInboxPage, renderGuestReservationInfoPage} = require('./../controllers/dashboard/dashboardController.js'); 
const authController = require('./../controllers/authController.js');

const renderDashboardRouter = express.Router();
const staffRouter = express.Router();
const managerRouter = express.Router();
const adminRouter = express.Router();
const userRouter = express.Router();

// ====================================
//           STAFF ROUTES
// ====================================

// Staff Router
renderDashboardRouter.use('/staff', staffRouter);

// Staff Routes
staffRouter.route('/viewReservations').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    viewStaffReservations
); //done

staffRouter.route('/edit').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    editStaffAccount
); //done

staffRouter.route('/changePassword').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    editStaffPassword
); //done

staffRouter.route('/updatePhoto').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    updateStaffPhoto
); //done

staffRouter.route('/createReservations').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    createReservations
); //semi-done rushed html & css

staffRouter.route('/inquiries').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, viewInquiries
); //semi-done rushed html & css

staffRouter.route('/checkin').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, checkin
); //done - no modal TODO

staffRouter.route('/reservation/:id').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff', 'manager', 'admin'), 
    authController.cacheControl, 
    viewSingleReservationStafPOV
); //done - modify for staff pov TODO

staffRouter.route('/:id').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('staff'), 
    authController.cacheControl, 
    loadStaffDashboard
); //done





// ====================================
//           MANAGER ROUTES
// ====================================

// Manager Router
renderDashboardRouter.use('/manager', managerRouter);
// Manager Routes
managerRouter.route('/offers').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewOffers
); // need link with view

managerRouter.route('/promotions').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewPromotions
); // need to link views

managerRouter.route('/rooms').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewRooms
); // need to link views

managerRouter.route('/report').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewReportPage
); // done

managerRouter.route('/createroom').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewCreateRoomPage
); //semi-done rushed html & css

managerRouter.route('/viewroom/:id').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewRoomPage 
); //semi-done rushed html & css

managerRouter.route('/createoffer').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewCreateOfferPage
); //semi-done rushed html & css

managerRouter.route('/viewoffer/:id').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewOfferPage
); //semi-done rushed html & css

managerRouter.route('/createpromotion').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewCreatePromotionPage
);
managerRouter.route('/viewpromotion').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager', 'admin'), 
    authController.cacheControl, 
    viewPromotionPage
);

managerRouter.route('/:id').get(
    authController.protect, 
    authController.verifyEmployee, 
    authController.restrictTo('manager'), 
    authController.cacheControl, 
    loadManagerDashboard
); // done



// ====================================
//           ADMIN ROUTES
// ====================================

// Admin Router
renderDashboardRouter.use('/USNVMQD493', adminRouter);
adminRouter.route('/users').get(viewUsers);
adminRouter.route('/:id').get(loadAdminDashboard);
// create user
// manage user permissions8






// ====================================
//           GUEST ROUTES
// ====================================

// Guest Router
renderDashboardRouter.use('/guest', userRouter);
// Guest Routes
userRouter.route("/update-email").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    updateGuestEmailPage
); // Done

userRouter.route("/upload-photo").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    uploadNewGuestPhotoPage
); // TODO - no page

userRouter.route("/update-password").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    updateGuestPasswordPage
); // Done

userRouter.route("/editacccount").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    editGuestProfilePage
); // Done

userRouter.route("/loyalty-history").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    loyaltyPointsHistoryPage
); // Done

userRouter.route("/reservations").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    reservationHistoryPage
); // Done

userRouter.route("/view-inbox").get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    viewInboxPage
); // Done

userRouter.route("/reservationinfo/:id").get(
    authController.protect, 
    authController.verifyGuest,
     authController.restrictTo('guest'), 
     authController.cacheControl, 
     renderGuestReservationInfoPage
); // Done

userRouter.route('/:id').get(
    authController.protect, 
    authController.verifyGuest, 
    authController.restrictTo('guest'), 
    authController.cacheControl, 
    loadUserDashboard
); // Done


module.exports = renderDashboardRouter;