exports.routeCheckout = async (req, res) => {
    res.render( "pages/hotelguest/createReservation",{ 
        layout:"main", 
        css: 'createaccount.css', 
        title:'Reservation',
        partialsCSS: [
            {name:"paymentSidebar.css"},
            {name:"breadcrumbs.css"},
            {name:"h1styled.css"},
            {name:"formContents.css"}
        ],
        scripts: [
            {src:"/js/utils/countdown.js"},
            {src:"/js/breadcrumbs.js"},
            {src:"/js/paymentSidebar.js"},
            {src:"/js/formContents.js"},
            {src:"/js/checkoutReservationPage.js"},
        ],
        bookingData: {
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
        },
        serverHeldSeconds: 900,
    });  
}

exports.renderCreateAccountPage = async (req, res) => {
    res.render( "pages/public/createaccount", { 
        layout:"main", 
        css: 'createaccount.css', 
        title:'Create Account',
        partialsCSS: [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ],
        scripts: [
            {src:"/js/utils/countdown.js"},
            {src:"/js/paymentSidebar.js"},
        ],
        disablePaymentSidebar: false,
        serverHeldSeconds: 900,
        bookingData: {
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
        }
    });  
}

exports.renderVerifyPage = async (req, res) => {
    res.render( "pages/public/verifyCreateAccount", { 
        layout:"main", 
        css: 'verifyCreateAccount.css', 
        title:'Verify Account',
        partialsCSS: [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ] ,
        disablePaymentSidebar: false,
        scripts: [
            {src:"/js/utils/countdown.js"},
            {src:"/js/verifyEmail.js"},
            {src:"/js/paymentSidebar.js"}
        ],
        serverSeconds: 60,
        serverHeldSeconds: 900,
        bookingData: {
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
        }
    }); 
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


