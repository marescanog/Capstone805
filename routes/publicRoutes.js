const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const {
    viewHomePage, viewAboutPage, viewGuestRoomsPage, vieRestaurantPage,
    viewContactUsPage, viewRoomOffersPage, viewCreateAccountPage
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

router.get("/roomOffers", authController.detect, viewRoomOffersPage)

router.get("/createaccount", authController.detect, viewCreateAccountPage)


// TODO combine with offer url
router.get("/roomdetails", (req, res) => {
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
});

router.get("/roomdetails/:id", (req, res) => {
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
})

router.get("/devlinks", (req, res) => {
    res.render( "pages/public/devlinks");  
})

router.get("/portal", (req, res) => {
    res.render( "pages/employee/portal",{ 
        layout:"main", 
        css: 'employee/portal.css', 
        title:'Employee Portal',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"employee/emploginform.css"}
        ],
        headerTitle: "Employee Online Portal",
        formData : {
            staff: {
                desc1: "Welcome to the Hotel Employee Portal. Your gateway to seamless operations and exceptional guest experiences.",
                desc2: "Log in to make a difference!"
            },
            admin: {
                desc1: "Welcome to the Admin Portal. Your control center for overseeing and optimizing user accounts within the hotel.",
                desc2: "Log in to unlock the full potential of your account management."
            }
        },
        scripts: [
            {src:"/js/loginStaff.js"},
        ],
    }); 
});

router.get("/verifyaccount", (req, res) => {
    res.render( "pages/public/verifyCreateAccount", { 
        layout:"main", 
        css: 'verifyCreateAccount.css', 
        title:'Verify Account',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"paymentSidebar.css"},
        ] ,
        disablePaymentSidebar: true,
        center: true,
        scripts: [
            {src:"/js/utils/countdown.js"},
            {src:"/js/verifyEmail.js"},
        ],
        serverSeconds: 60
    });  
})

router.get("/faqsPolicies", (req, res) => {
    res.render( "pages/public/faqsPolicies", { 
        layout:"main", 
        css: 'faqsPolicies.css', 
        title:'Faqs & Policies',
        partialsCSS: [
            {name:"h1styled.css"}
        ] ,
        // scripts: [
        //     {src:"/js/utils/countdown.js"},
        // ]
    });  
})








// move since its a post route
router.post("/createaccount", (req, res) => {
    res.redirect('/verifyaccount');
}
);

// move to guest dashboard
router.get("/editaccount", (req, res) => {
    res.render( "pages/hotelguest/editAccount", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'edit account',
    });  
})

// move to guest dashbaord
// loyalty history
router.get("/loyaltyhistory", (req, res) => {
    res.render( "pages/hotelguest/royaltyHistory", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'royalty History',
    });  
})

// DELETE move to guest dashboard
// router.get("/userdashboard", (req, res) => {
//     res.render( "pages/hotelguest/userdashboard", {
//         layout:"main", 
//         title:'Profile',  
//     });  
// })

// move to guest dashboard
router.get("/updatepassword", (req, res) => {
    res.render( "pages/hotelguest/updatepassword");  
})



// move to guest dashboard
router.get("/reservations", (req, res) => {
    res.render( "pages/hotelguest/reservationList",{ 
        layout:"main", 
        css: 'guest/reservationList.css', 
        title:'Reservations',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
})

// move to guest dashboard
router.get("/editaccount", (req, res) => {
    res.render( "pages/hotelguest/editAccount",{ 
        layout:"main", 
        css: 'guest/editaccount.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});

// move to guest dashboard
router.get("/update-email", (req, res) => {
    res.render( "pages/hotelguest/update-email",{ 
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});

// move to guest dashboard
router.get("/view-inquiries", (req, res) => {

    const inquiries = [
        { title: 'Will the spa be', detail: 'Will the spa be open till mid night.' },
        { title: 'Is room service', detail: 'Is room service available in single rooms ' },
        { title: 'Is there any', detail: 'Is there any option to book hotel car service' },
        // Add more inquiries as needed
    ];

    res.render( "pages/hotelguest/view-inquiries",{ 
        inquiries : inquiries,
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});


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
 
// move to guest dashboard
router.get("/reservationinfo/:id", (req, res) => {
    res.render( "pages/hotelguest/reservation",{ 
        layout:"main", 
        css: 'createaccount.css', 
        title:'Reservation',
        partialsCSS: [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"},
            {name:"formContents.css"},
        ] ,
        scripts: [
            {src:"/js/reservationinfo.js"},
        ],
        disablePaymentSidebar: false,
        addFlatPicker: true,
        userData: {
            firstName: "John",
            lastName: "Doe",
        },
        bookingData: {
            reservationID: 'ASH7DO',
            roomDetails: {
                roomType: "Deluxe Room",
                amenities: ["Breakfast Included","Welcome Drinks"],
                bedType: "Queen",
                numberOfBeds: 1,
                pricePerNight: 250
            },
            checkinDate: "2024-03-16",
            checkoutDate: "2024-03-20",
            thumbnail: {
                small: {
                    fileType: "jpg",
                    url: "4f1651f09d7dc7a4e3ce670558837b247c2671703fa1eeedf73ba4f59c17252f"
                }
            },
            status: "pending",
            numberOfGuests: 3,
            estimatedArrivalTime: "1:00 PM",
            paymentDetails: {
                cardType: "Mastercard",
                lastFour: "9845"
            },
            priceBreakdown: {
                totalCharge: 630.89,
                totalPaid: 189.27,
                fees: [
                    {"Taxes & Fees": 126.18},
                    {"Subtotal": 504.71},
                    {"Extra Person Fees": 4.71}
                ],
                promotions: []
            }
        }
    });  
})

// move this route since this is post and does not render any pages
// maybe make a reservation api router
router.post("/createReservation", (req, res) => {
    // console.log(JSON.stringify(req.body))
    // res.send(req.body)
    try {
        res.json({ success: true, message: "Reservation created successfully!" });
    } catch (error){
        console.error("Save failed:", error);
        res.json({ success: false, message: "Failed to create reservation. Please try again." });
    }
})




module.exports = router;