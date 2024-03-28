var express = require("express");
var app = express();

exports.loadUserDashboard = (req, res, next) => {
    res.render( "pages/hotelguest/userdashboard", {
        userType:"Guest",
        id: "asdasdsadsadadsa",
        layout:"main", 
        css: 'guest/userDashboard.css', 
        title:'Profile',  
        addSlick: true,
        partialsCSS: [
            // {name:"h1styled.css"},
            {name:"accountInfoSideBar.css"},
            {name:"accountButtonList.css"}
        ],
        scripts: [
            {src:"/js/userDashboard.js"},
        ],
        buttonData: [
            {name:"View Reservation History",url:"/dashboard/guest/reservations"},
            {name:"Browse Room Offers",url:"/roomOffers"},
            {name:"View Inbox",url:"/dashboard/guest/view-inbox"}
        ],
        reservations: [
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/dashboard/guest/reservationinfo/65edeb166f77f37cbaec2fd2'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/dashboard/guest/reservationinfo/65edeb166f77f37cbaec2fd2'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/dashboard/guest/reservationinfo/65edeb166f77f37cbaec2fd2'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/dashboard/guest/reservationinfo/65edeb166f77f37cbaec2fd2'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/dashboard/guest/reservationinfo/65edeb166f77f37cbaec2fd2'
            },
        ]
    });  
}

exports.uploadNewGuestPhotoPage = (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'The uploadNewGuestPhotoPage route is not yet defined!'
    });
}

exports.updateGuestEmailPage = (req, res, next) => {
    res.render( "pages/hotelguest/update-email",{ 
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
}

exports.updateGuestPasswordPage = (req, res, next) => {
    res.render( "pages/hotelguest/updatepassword"); 
}

exports.editGuestProfilePage = (req, res, next) => {
    res.render( "pages/hotelguest/editAccount", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'edit account',
    });  
}

exports.loyaltyPointsHistoryPage = (req, res, next) => {
    res.render( "pages/hotelguest/royaltyHistory", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'royalty History',
    }); 
}

exports.reservationHistoryPage = (req, res, next) => {
    res.render( "pages/hotelguest/reservationList",{ 
        layout:"main", 
        css: 'guest/reservationList.css', 
        title:'Reservations',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
}

exports.viewInboxPage = (req, res, next) => {
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
}


exports.renderGuestReservationInfoPage = async (req, res) => {
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
}