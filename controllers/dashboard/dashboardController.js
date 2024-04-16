const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder');
const {calculateDaysBetweenDates} = require('./../../models/modelUtils/utilityFunctions.js');
const {getUpcomingreservations, getPastreservations} = require('./../reservationController.js');

exports.loadUserDashboard = catchAsync( async (req, res, next) => {

    if(!req?.decoded?.id){
        req.alertToLogin = true;
    }

    if(!req?.user){
        req.alertToLogin = true;
        return res.redirect('/');
    }

    const {
        firstName, lastName, mobileNumber, address, avatarPhotoUrl, emailAddress
    } = req.user;


    const upcomingResult = await getUpcomingreservations(req?.decoded?.id);

    if(upcomingResult?.success){
        upcoming = upcomingResult.data;
    }


    const mappedForDashboard = await Promise.all(
        upcoming.map(el=>{
            // checkinDateObj, checkoutDateObj
            const daysBetween = calculateDaysBetweenDates(el.checkinDateObj, el.checkoutDateObj);
            const months = Math.floor(daysBetween / 31);
            // console.log(months)
            const dateType = months > 0 ? "month" : "day";
            const interValText = `In ${months > 0 ? months : daysBetween} ${dateType}${daysBetween > 1 ? 's' : ''}`
            return {
                roomtType: el.roomType,
                checkIn: el.checkinDate,
                checkOut: el.checkoutDate,
                interval: interValText,
                img:  el.thumbNail,
                url: `/dashboard/guest/reservationinfo/${el.linkrefID}`
            }
        })
    )

    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "guest/userDashboard.css");
    VB.addOptions("title", "My Profile");
    VB.addOptions("addSlick", true);
    VB.addOptions("partialsCSS", [
        {name:"accountInfoSideBar.css"},
        {name:"accountButtonList.css"}
    ]);
    VB.addOptions("scripts", [
        {src:"/js/userDashboard.js"},
    ]);
    VB.addOptions("buttonData", [
        {name:"View Reservation History",url:"/dashboard/guest/reservations"},
        {name:"Browse Room Offers",url:"/roomOffers?checkin=today&checkout=tomorrow&guests=1&rooms=1"},
        {name:"View Inbox",url:"/dashboard/guest/view-inbox"}
    ]);
    VB.addOptions("sidebarData", {
        img: null,
        firstName:firstName,
        lastName: lastName,
        address: `${address.address}, ${address.city}, ${address.postalCode} ${address.country}`,
        emailAddress: emailAddress,
        mobileNumber: mobileNumber,
    });
    VB.addOptions("reservations", mappedForDashboard);
    res.render( "pages/hotelguest/userdashboard",VB.getOptions());
})

exports.uploadNewGuestPhotoPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("editMode", true);
    VB.addOptions("css", "dash.css");
    VB.addOptions("title", "Update Photo");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"},
        {name:"accountInfoSideBar.css"},
    ] );
    res.render( "pages/hotelguest/updatePhoto",VB.getOptions());  
}

exports.updateGuestEmailPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "style.css");
    VB.addOptions("title", "Edit Account");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"},
    ] );
    res.render( "pages/hotelguest/update-email",VB.getOptions());  
}

exports.updateGuestPasswordPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    res.render( "pages/hotelguest/updatepassword",VB.getOptions()); 
}

exports.editGuestProfilePage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "editaccount.css");
    VB.addOptions("title", "Edit Account");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ] );
    VB.addOptions("scripts", [
        {src:"/js/editGuestProfile.js"},
    ]);
    res.render( "pages/hotelguest/editAccount",VB.getOptions()); 
}

exports.loyaltyPointsHistoryPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "editaccount.css");
    VB.addOptions("title", "Loyalty History");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ] );
    res.render( "pages/hotelguest/royaltyHistory",VB.getOptions()); 
}

exports.reservationHistoryPage = catchAsync(async (req, res, next) => {
    // console.log(`reservations ${req?.decoded?.id}`)
    if(!req?.decoded?.id){
        return res.redirect('/home');
    } 

    let upcoming = [];
    let past = [];
    const upcomingResult = await getUpcomingreservations(req?.decoded?.id);
    const pastResult = await getPastreservations(req?.decoded?.id);
    
    upcoming = [
        {
            thumbNail: "../../assets/images/room1.jpg",
            alt: "room thumbnail image",
            roomType: "Deluxe Room",
            checkinDate: "28 Jan 2021",
            checkoutDate: "31 Jan 2021",
            numberOfGuests: 2,
            averagePricePerNight: 239,
            reservationID: 'ADD0888',
            linkrefID: 'asdjashkdsajdhsakdhs'
        }
    ]

    if(upcomingResult?.success){
        upcoming = upcomingResult.data;
    }
    
    if(pastResult?.success){
        past = pastResult.data;
    }

    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });

    VB.addOptions("css", "guest/reservationList.css");
    VB.addOptions("title", "Reservations");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ] );
    VB.addOptions("upcoming", upcoming);
    VB.addOptions("past", past);
    res.render( "pages/hotelguest/reservationList", VB.getOptions());  


})

exports.viewInboxPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "style.css");
    VB.addOptions("title", "Inbox");
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ] );
    VB.addOptions("inquiries", [
        { title: 'Will the spa be', detail: 'Will the spa be open till mid night.' },
        { title: 'Is room service', detail: 'Is room service available in single rooms ' },
        { title: 'Is there any', detail: 'Is there any option to book hotel car service' },
        // Add more inquiries as needed
    ]);
    res.render( "pages/hotelguest/view-inquiries",VB.getOptions());  
}


exports.renderGuestReservationInfoPage = async (req, res) => {
    const {
        firstName, lastName, mobileNumber, address, avatarPhotoUrl, emailAddress
    } = req.user;

    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType:"Guest",
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "createaccount.css");
    VB.addOptions("title", "Reservation Info");
    VB.addOptions("partialsCSS", [
        {name:"paymentSidebar.css"},
        {name:"h1styled.css"},
        {name:"formContents.css"},
    ] );
    VB.addOptions("scripts", [
        {src:"/js/reservationinfo.js"},
    ]);
    VB.addOptions("disablePaymentSidebar", false);
    VB.addOptions("addFlatPicker", true);
    VB.addOptions("userData",{
        firstName: "John",
        lastName: "Doe",
    });
    VB.addOptions("bookingData",{
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
    });
    res.render( "pages/hotelguest/reservation",VB.getOptions());
}