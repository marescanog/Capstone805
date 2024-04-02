const catchAsync = require('../apiUtils/catchAsync');
const ViewBuilder = require('./../apiUtils/viewBuilder')
const AppError = require('./../apiUtils/appError.js');

exports.routeCheckout = catchAsync(async (req, res) => {
    if(req?.decoded?.id){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        })
        VB.addOptions("css", "createaccount.css");
        VB.addOptions("title", "Reservation");
        VB.addOptions("partialsCSS", [
            {name:"paymentSidebar.css"},
            {name:"breadcrumbs.css"},
            {name:"h1styled.css"},
            {name:"formContents.css"}
        ]);
        VB.addOptions("scripts", [
            {src:"/js/utils/countdown.js"},
            {src:"/js/breadcrumbs.js"},
            {src:"/js/paymentSidebar.js"},
            {src:"/js/formContents.js"},
            {src:"/js/checkoutReservationPage.js"},
        ]);
        VB.addOptions("bookingData", {
            roomType: "Deluxe Room",
            offers:["Breakfast Included","Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks"],
            bedType: "Queen",
            bedCount: 1,
            amenities: [
                {name: "Bathroom", count: 1},
                {name: "Balcony", count: 1}
            ],
            thumbnailSmall: process.env.AWS_ROOM_TYPE_IMAGE_URL+"4f1651f09d7dc7a4e3ce670558837b247c2671703fa1eeedf73ba4f59c17252f.jpg",
            fileType: "jpg",
            checkOut: "Jan 28, 2024",
            checkIn: "Jan 28, 2024",
            guests: 3,
            rate:250,
            totalNights: 2,
            extraPersonFee: 4.71,
            discounts : []
        });
        VB.addOptions("serverHeldSeconds", 900);
        res.render("pages/hotelguest/createReservation", VB.getOptions());
    } else {
        // redirect to the create account page
        res.redirect('/checkout/createaccount')
    }
})

exports.renderCreateAccountPage = async (req, res) => {
    if(req?.decoded?.id){
        // redirect to the checkout
        res.redirect('/checkout')
    } else {
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        })
        VB.addOptions("NoHeaderSignup", true);
        VB.addOptions("css", "createaccount.css");
        VB.addOptions("title", "Create Account");
        VB.addOptions("partialsCSS", [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("scripts", [
            {src:"/js/utils/countdown.js"},
            {src:"/js/paymentSidebar.js"},
        ]);
        VB.addOptions("disablePaymentSidebar", false);
        VB.addOptions("serverHeldSeconds", 900);
        VB.addOptions("bookingData", {
                roomType: "Deluxe Room",
                offers:["Breakfast Included","Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks"],
                bedType: "Queen",
                bedCount: 1,
                amenities: [
                    {name: "Bathroom", count: 1},
                    {name: "Balcony", count: 1}
                ],
                thumbnailSmall: process.env.AWS_ROOM_TYPE_IMAGE_URL+"4f1651f09d7dc7a4e3ce670558837b247c2671703fa1eeedf73ba4f59c17252f.jpg",
                fileType: "jpg",
                checkOut: "Jan 28, 2024",
                checkIn: "Jan 28, 2024",
                guests: 3,
                rate:250,
                totalNights: 2,
                extraPersonFee: 4.71,
                discounts : []
            });
        res.render("pages/public/createaccount", VB.getOptions());
    }
}

exports.renderVerifyPage = async (req, res) => {
    if(req?.decoded?.id){
        // redirect to the checkout
        res.redirect('/checkout')
    } else {
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        })
        VB.addOptions("NoHeaderSignup", true);
        VB.addOptions("css", "verifyCreateAccount.css");
        VB.addOptions("title", "Verify Account");
        VB.addOptions("partialsCSS", [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("disablePaymentSidebar", false);
        VB.addOptions("scripts", [
            {src:"/js/utils/countdown.js"},
            {src:"/js/verifyEmail.js"},
            {src:"/js/paymentSidebar.js"}
        ]);
        VB.addOptions("serverSeconds", 60);
        VB.addOptions("serverHeldSeconds", 900);
        VB.addOptions("bookingData", {
            roomType: "Deluxe Room",
            offers:["Breakfast Included","Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks"],
            bedType: "Queen",
            bedCount: 1,
            amenities: [
                {name: "Bathroom", count: 1},
                {name: "Balcony", count: 1}
            ],
            thumbnailSmall: process.env.AWS_IMAGE_URL+"4f1651f09d7dc7a4e3ce670558837b247c2671703fa1eeedf73ba4f59c17252f",
            fileType: "jpg",
            checkOut: "Jan 28, 2024",
            checkIn: "Jan 28, 2024",
            guests: 3,
            rate:250,
            totalNights: 2,
            extraPersonFee: 4.71,
            discounts : []
        });
        res.render("pages/public/verifyCreateAccount", VB.getOptions());
    }
}

exports.routeCreateAccountPost = async (req, res) => {
    // do save db stuff here
    res.redirect('/checkout/verifyaccount');
}

// route has to be post
exports.staffCreateReservation = async (req, res) => {
    // do save db stuff here

    // change link to staff view reservations
    // res.redirect('/checkout/verifyaccount');
}

exports.staffRenderCreateReservationPage = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The staffRenderCreateReservationPage route is not yet defined!'
    });
}


