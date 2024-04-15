const catchAsync = require('../apiUtils/catchAsync');
const ViewBuilder = require('./../apiUtils/viewBuilder')
const AppError = require('./../apiUtils/appError.js');
const {Room} = require('../models/roomModel');
const Guest = require('../models/guestModel.js');
const {getSecondsBetweenDates, isValidDate, formatDate_Mon_DD_YYYY} = require('./../models/modelUtils/utilityFunctions');

function getServerSeconds(expires_at){
    if(expires_at){
        const serverSeconds =  Math.ceil(getSecondsBetweenDates(new Date(), new Date(expires_at), false));
        return serverSeconds < 0 ? 0 : serverSeconds;
    }
    return 0;
}

exports.routeCheckout = catchAsync(async (req, res) => {
    // const {roomdetails, offers, checkin, checkout} = req.query;
    // TODO validate before passing
    /*
     {
                roomType: "Deluxe Room",
                offers:["Breakfast Included","Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks", "Welcome Drinks"],
                bedType: "Queen",
                bedCount: 1,
                amenities: [
                    {name: "Bathroom", count: 1},
                    {name: "Balcony", count: 1}
                ],
                thumbnailSmall: process.env.AWS_ROOM_TYPE_IMAGE_URL+"4f1651f09d7dc7a4e3ce670558837b247c2671703fa1eeedf73ba4f59c17252f",
                fileType: "jpg",
                checkOut: "Jan 28, 2024",
                checkIn: "Jan 28, 2024",
                guests: 3,
                rate:250,
                totalNights: 2,
                extraPersonFee: 4.71,
                discounts : []
            }
    */
    if(req?.decoded?.id){
        let guestInfo;
        let loyaltyDetails;
        // get user details
        try {
            await Guest.findById(req.decoded.id).select('firstName lastName address mobileNumber loyaltyHistory')
            .then(guest => {
                if (guest) {
                    loyaltyDetails = guest.loyaltyHistory;
                    guestInfo = guest;
                    delete guestInfo.loyaltyHistory;
                } else {
                    console.log('No guest found with that ID.');
                    return res.redirect(`/checkout/createaccount`);
                }
            })
            .catch(err => {
                console.error('Error fetching guest:', err);
                return next(new AppError('Error loading guest details', 500));
            });
        } catch (err){
            console.log(`${err}, checkout controller`)
            return next(new AppError('Error loading guest details', 500))
        }
        // TI avoid error "Handlebars: Access has been denied to resolve the property "firstName" because it is not an "own property" of its parent."
        const finalInfo = {
            firstName: guestInfo?.firstName,
            lastName: guestInfo?.lastName,
            mobileNumber: guestInfo?.mobileNumber,
            address: guestInfo?.address?.address,
            city: guestInfo?.address?.city,
            postalCode: guestInfo?.address?.postalCode,
            country: guestInfo?.address?.country,
        }
        if(req.session.checkout){

            let bookingData;
            const {sessionID, offer_id, room_id, created_at, expires_at, numberOfGuests, numberOfRooms} = req.session.checkout;
            const guestID = req?.decoded?.id;

            // Let us get the booking data based on the session checkout
            // Validate Checkin & Checkout Dates
            let checkin =  req.session.checkout.checkin;
            let checkout = req.session.checkout.checkout;

            //YYYY-MM-DD
            if(checkin === 'today' || checkin == null || !(isValidDate(checkin))){
                const today = new Date();
                checkin = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            }
            if(checkout === 'tomorrow' || checkout == null || !(isValidDate(checkout))){
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate()+1);
                checkout = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
            }

            // convert to dates
            const [ci_year, ci_month,  ci_day] = checkin.split('-').map(Number);
            const [co_year, co_month,  co_day] = checkout.split('-').map(Number);
            // console.log(checkin)
            // console.log(checkout)
            // console.log(`${ci_year} ${ci_month} ${ci_day}`)
            // console.log(`${co_year} ${co_month} ${co_day}`)
            const checkinDate = new Date(ci_year, ci_month-1,  ci_day);
            const checkoutDate = new Date(co_year, co_month-1,  co_day);
            // console.log(checkinDate)
            // console.log(checkoutDate)

            try {
                bookingData = await Room.getCheckoutBookingData(offer_id, room_id, checkinDate, checkoutDate, numberOfGuests, numberOfRooms, guestID);
                // console.log(bookingData)
            } catch (err) {
                console.log(err)
            }

            const VB = new ViewBuilder({
                alertToLogin: req?.alertToLogin??false,
                userType: req?.decoded?.type??null,
                id:req?.decoded?.id??null,
            });
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
            VB.addOptions("bookingData", bookingData);
            VB.addOptions("serverHeldSeconds", getServerSeconds(expires_at));
            VB.addOptions("guestInfo", finalInfo);
            return res.render("pages/hotelguest/createReservation", VB.getOptions());
        }
        return    res.redirect("/checkoutSessionExpired");   
    } 

    // redirect to the create account page
    res.redirect(`/checkout/createaccount`);
    // res.redirect(`/checkout/createaccount?roomdetails=${roomdetails}&offers=${offers}&checkin=${checkin}&checkout=${checkout}&guests=1&rooms=1`)
    
})

exports.renderCreateAccountPage = catchAsync(async (req, res) => {
    console.log(req?.decoded?.id)
    if(req?.decoded?.id){
        // redirect to the checkout
        return res.redirect('/checkout')
    } 

    if(req.session.checkout){
        // TODO Check if session is expired
        // const {roomdetails, offers, checkin, checkout} = req.query;
        // GET BOOKING DATA
        let bookingData;
        const {sessionID, offer_id, room_id, created_at, expires_at, numberOfGuests, numberOfRooms} = req.session.checkout;
        const guestID = req?.decoded?.id;

        // Validate Checkin & Checkout Dates
        let checkin =  req.session.checkout.checkin;
        let checkout = req.session.checkout.checkout;

        //YYYY-MM-DD
        if(checkin === 'today' || checkin == null || !(isValidDate(checkin))){
            const today = new Date();
            checkin = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        }
        if(checkout === 'tomorrow' || checkout == null || !(isValidDate(checkout))){
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            checkout = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
        }

        // convert to dates
        const [ci_year, ci_month,  ci_day] = checkin.split('-').map(Number);
        const [co_year, co_month,  co_day] = checkout.split('-').map(Number);
        // console.log(checkin)
        // console.log(checkout)
        // console.log(`${ci_year} ${ci_month} ${ci_day}`)
        // console.log(`${co_year} ${co_month} ${co_day}`)
        const checkinDate = new Date(ci_year, ci_month-1,  ci_day);
        const checkoutDate = new Date(co_year, co_month-1,  co_day);
        // console.log(checkinDate)
        // console.log(checkoutDate)

        try {
            bookingData = await Room.getCheckoutBookingData(offer_id, room_id, checkinDate, checkoutDate, numberOfGuests, numberOfRooms, guestID);
            // console.log(bookingData)
        } catch (err) {
            console.log(err)
        }


        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        })
        VB.addOptions("NoHeaderSignup", true);
        VB.addOptions("justAddress", true);
        VB.addOptions("css", "createaccount.css");
        VB.addOptions("title", "Create Account");
        VB.addOptions("partialsCSS", [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("scripts", [
            {src:"/js/utils/countdown.js"},
            {src:"/js/paymentSidebar.js"},
            {src:"/js/createAccount.js"},
        ]);
        VB.addOptions("disablePaymentSidebar", false);
        VB.addOptions("serverHeldSeconds", getServerSeconds(expires_at));
        VB.addOptions("bookingData", bookingData);
        return res.render("pages/public/createaccount", VB.getOptions());
    }

    res.redirect("/checkoutSessionExpired");    
})

exports.renderVerifyPage = async (req, res) => {

    if(req?.decoded?.id){
        // redirect to the checkout
        return res.redirect('/checkout')
    } 

    if (!req.session.createdAccount) {
        return res.redirect('/checkout/createaccount'); 
    }

    if(req.session.checkout){
        // TODO Check if session is expired
        // const {roomdetails, offers, checkin, checkout} = req.query;
        // GET BOOKING DATA
        let bookingData;
        const {sessionID, offer_id, room_id, created_at, expires_at, numberOfGuests, numberOfRooms} = req.session.checkout;
        const guestID = req?.decoded?.id;

        // Validate Checkin & Checkout Dates
        let checkin =  req.session.checkout.checkin;
        let checkout = req.session.checkout.checkout;

        //YYYY-MM-DD
        if(checkin === 'today' || checkin == null || !(isValidDate(checkin))){
            const today = new Date();
            checkin = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        }
        if(checkout === 'tomorrow' || checkout == null || !(isValidDate(checkout))){
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            checkout = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
        }

        // convert to dates
        const [ci_year, ci_month,  ci_day] = checkin.split('-').map(Number);
        const [co_year, co_month,  co_day] = checkout.split('-').map(Number);
        // console.log(checkin)
        // console.log(checkout)
        // console.log(`${ci_year} ${ci_month} ${ci_day}`)
        // console.log(`${co_year} ${co_month} ${co_day}`)
        const checkinDate = new Date(ci_year, ci_month-1,  ci_day);
        const checkoutDate = new Date(co_year, co_month-1,  co_day);
        // console.log(checkinDate)
        // console.log(checkoutDate)

        try {
            bookingData = await Room.getCheckoutBookingData(offer_id, room_id, checkinDate, checkoutDate, numberOfGuests, numberOfRooms, guestID);
            // console.log(bookingData)
        } catch (err) {
            console.log(err)
        }

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

        VB.addOptions("serverSeconds", 60); // TO DO SET SERVER SECONDS AFTER EMAIL IS CREATED
        VB.addOptions("emailSentTo", req.session.createdAccount);
        VB.addOptions("serverHeldSeconds", getServerSeconds(expires_at));
        VB.addOptions("bookingData", bookingData);
        return res.render("pages/public/verifyCreateAccount", VB.getOptions());  
    }

    res.redirect("/checkoutSessionExpired");  
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


