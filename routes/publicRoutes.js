const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const {createReservation} = require('./../controllers/reservationController');
const {
    viewHomePage, viewAboutPage, viewGuestRoomsPage, vieRestaurantPage,
    viewContactUsPage, viewRoomOffersPage, viewCreateAccountPage, viewVerifyAccountPage,
    viewEmployeePortalPage, viewFAQPage, viewForgotPasswordPage, registerUserAccount,
    viewRoomByIDWithOffer, viewRoomByID, viewCheckoutSessionExpiredRedirect
} = require('./../controllers/publicViewsController');

/*
    Notes: 
    authController.detect checks if jwt is saved in httpcookie
        if jwt is saved, it updates the header accordingly with correct user
        if jwt is saved but expired or tampered, a pop up displays informing the user of session timeout
        if no jwt, default header is displayed
*/

router.get("/", authController.detect, viewHomePage);

router.get("/home", authController.detect, viewHomePage);

router.get("/about", authController.detect, viewAboutPage);

router.get("/guestrooms", authController.detect, viewGuestRoomsPage)

router.get("/restaurant", authController.detect, vieRestaurantPage);

router.get("/contactUs", authController.detect, viewContactUsPage);

router.get("/roomOffers", authController.detect, viewRoomOffersPage);

router.get("/createaccount", authController.detect, viewCreateAccountPage);

router.get("/verifyaccount", authController.detect, viewVerifyAccountPage);

router.get("/portal", authController.detect,  authController.cacheControl, viewEmployeePortalPage);

router.get("/faqsPolicies", authController.detect, viewFAQPage);

router.get("/forgotpassword", authController.detect, viewForgotPasswordPage)

router.get("/forgotpassword", authController.detect, viewForgotPasswordPage)

router.get("/checkoutSessionExpired", authController.detect, viewCheckoutSessionExpiredRedirect)

router.get("/roomdetails/:roomID/offers/:offerID", authController.detect, viewRoomByIDWithOffer);

router.get("/roomdetails/:id", authController.detect, viewRoomByID)

router.get("/roomdetails", authController.detect, (req, res) => {
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
});



router.get("/devlinks", (req, res) => {
    res.render( "pages/public/devlinks");  
})




// move since its a post route // registerUserAccount
// router.post("/createaccount", (req, res) => {
//     console.log(req)
//     // res.redirect('/verifyaccount');
//     res.send({message:"You are creating an account"})
// }
// );
router.post("/createaccount", authController.registerUserAccount);


// Handle the form submission
// Note we werent supposed to make apis yet, just the frontend
// Edit this out later
router.post('/submit-feedback', (req, res) => {
    console.log(req.body); // Log the form data to the console
    res.send('Thank you for your feedback!'); // Send a response to the client
});

// Note again we werent supposed to make apis yet, just the frontend
// Edit this out later
// Handle the form submission for updating email
router.post('/submit-new-email', (req, res) => {  
    res.render( "pages/hotelguest/update-email",{ 
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ],
        successMessage: 'Your email has been updated.'
    });  
});



// move this route since this is post and does not render any pages - no time to refactor code
// maybe make a reservation api router - no time to make reservation api router
router.post("/createReservation",  authController.detect, createReservation);


module.exports = router;