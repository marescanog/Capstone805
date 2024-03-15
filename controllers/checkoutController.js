exports.routeCheckout = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The routeCheckout route is not yet defined!'
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
            {src:"/js/paymentSidebar.js"},
        ],
        disablePaymentSidebar: false,
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
    res.status(500).json({
        status: 'error',
        message: 'The renderVerifyPage from checkout route is not yet defined!'
    });
}

exports.renderGuestInformationPage = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The renderGuestInformationPage route is not yet defined!'
    });
}

exports.routeCreateAccountPost = async (req, res) => {
    // do save db stuff here
    res.redirect('/checkout/verifyaccount');
}
