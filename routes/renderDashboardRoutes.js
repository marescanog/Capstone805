const express = require('express');
const {loadStaffDashboard, editStaffAccount, editStaffPassword, updateStaffPhoto, createReservations, viewStaffReservations, viewInquiries, checkin } = require('./../controllers/dashboard/staffDashboardController.js');
const {loadManagerDashboard, viewOffers, viewPromotions, viewRooms} = require('./../controllers/dashboard/managerDashboardController.js');
const {loadAdminDashboard, viewUsers } = require('./../controllers/dashboard/adminDashboardController.js');
const {loadUserDashboard} = require('./../controllers/dashboard/dashboardController.js'); 
const authController = require('./../controllers/authController.js');

const renderDashboardRouter = express.Router();
const staffRouter = express.Router();
const managerRouter = express.Router();
const adminRouter = express.Router();
const userRouter = express.Router();

// Staff Router
renderDashboardRouter.use('/staff', staffRouter);
// Staff Routes
staffRouter.route('/viewReservations').get(viewStaffReservations);
staffRouter.route('/edit').get(editStaffAccount);
staffRouter.route('/changePassword').get(editStaffPassword);
staffRouter.route('/updatePhoto').get(updateStaffPhoto);
staffRouter.route('/createReservations').get(createReservations);
staffRouter.route('/inquiries').get(viewInquiries);
staffRouter.route('/checkin').get(checkin);
staffRouter.route('/reservation').get((req, res)=>{res.send('you are at the view single reservation from staff view')});
staffRouter.route('/reservation/edit').get((req, res)=>{res.send('you are at the edit single reservation from staff view')});
staffRouter.route('/:id').get(authController.protect, authController.verifyEmployee, loadStaffDashboard);



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


// Staff Router
renderDashboardRouter.use('/guest', userRouter);
// user
userRouter.route('/:id').get((req, res)=>{
    res.render( "pages/hotelguest/userdashboard", {
        layout:"main", 
        title:'Profile',  
    });  
});


module.exports = renderDashboardRouter;