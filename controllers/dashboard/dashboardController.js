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
            {name:"View Reservation History",url:"/reservations"},
            {name:"Browse Room Offers",url:"/roomOffers"},
            {name:"View Inbox",url:"/view-inquiries"}
        ],
        reservations: [
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/reservationinfo/adssadsa'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/reservationinfo/adssadsa'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/reservationinfo/adssadsa'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/reservationinfo/adssadsa'
            },
            {
                roomtType: "Room Name",
                checkIn: "Jan 28,2024",
                checkOut: "Jan 30,2024",
                interval: "In 1 month",
                img:"../../../assets/images/room1.jpg",
                url:'/reservationinfo/adssadsa'
            },
        ]
    });  
}





// EDIT DELETE LATER I GUESS
exports.renderReservationInfoPage = async (req, res) => {
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