const express = require('express');
const {loadStaffDashboard, editStaffAccount, editStaffPassword, updateStaffPhoto, createReservations, viewStaffReservations, viewInquiries, checkin } = require('./../controllers/dashboard/staffDashboardController.js');
// const {loadManagerDashboard} = require('./../controllers/dashboard/managerDashboardController.js');
// const {loadAdminDashboard } = require('./../controllers/dashboard/adminDashboardController.js');
const renderDashboardRouter = express.Router();
const staffRouter = express.Router();
const adminRouter = express.Router();
const managerRouter = express.Router();

// Staff Router
renderDashboardRouter.use('/staff', staffRouter);
// Staff Routes
staffRouter.route('/viewReservations').get(viewStaffReservations);
staffRouter.route('/edit/:id').get(editStaffAccount);
staffRouter.route('/changePassword/:id').get(editStaffPassword);
staffRouter.route('/updatePhoto/:id').get(updateStaffPhoto);
staffRouter.route('/createReservations').get(createReservations);
staffRouter.route('/inquiries').get(viewInquiries);
staffRouter.route('/checkin').get(checkin);
staffRouter.route('/:id').get(loadStaffDashboard);


// // Manager Router
// // Manager Router
// dashboardRouter.use('/manager', managerRouter);
// // Manager base route
// staffRouter.route('/').get(loadStaffDashboard);
// // Manager Routes
// staffRouter.route('/editAccount').get(editStaffAccount);
// staffRouter.route('/changePassword').get(editStaffPassword);
// staffRouter.route('/viewReservations').get(viewStaffReservations);
// staffRouter.route('/createReservations').get(createReservations);
// staffRouter.route('/inquiries').get(viewInquiries);
// staffRouter.route('/checkin').get(checkin);


// // Staff Router
// dashboardRouter
// .route('/USNVMQD493')
// .get(loadAdminDashboard);




// // user
// dashboardRouter
// .route('/user')
// .get(loadUserDashboard);


module.exports = renderDashboardRouter;