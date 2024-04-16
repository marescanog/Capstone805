const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder');
const AppError = require('./../../apiUtils/viewBuilder');
const {calculateDaysBetweenDates, formatDate_Mon_DD_YYYY, formatDate_YYY_d_MM_d_dd, compareDates} = require('./../../models/modelUtils/utilityFunctions.js');
const {getUpcomingreservations, getPastreservations, getReservationByID} = require('./../reservationController.js');
var ObjectId = require('mongoose').Types.ObjectId;

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

    const today = new Date();
    const mappedForDashboard = await Promise.all(
   
        upcoming.map(el=>{
            // checkinDateObj, checkoutDateObj
            const daysBetween = calculateDaysBetweenDates(today, el.checkinDateObj);
            const months = Math.floor(daysBetween / 31);
            // console.log(daysBetween)
            const dateType = months > 0 ? "month" : "day";
            const interValText = `In ${months > 0 ? months : daysBetween} ${dateType}${(dateType == "month" ? months :  daysBetween) > 1 ? 's' : ''}`
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
    VB.addOptions("reservations", mappedForDashboard.filter(el=>el!=null));
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


exports.renderGuestReservationInfoPage = async (req, res, next) => {
    const {id} = req?.params;

    if(!ObjectId.isValid(id) || id == null){
        return next(AppError('The reservation was not found!', 404))
    }

    if(!req?.decoded?.id){
        req.alertToLogin = true;
    } 

    if(!req?.user){
        return res.redirect('/home');
    } 

    // pull up the reservation and if it does not belong to the user then 401 it
    const reservationResult = await getReservationByID(req?.decoded?.id, id);

    // console.log('dashboard Controller line 243')
    // console.log(JSON.stringify(reservationResult.data[0], null, '\t'));

    let reservData;
    if(reservationResult.success){
        reservData = reservationResult.data && reservationResult.data.length > 0 ? reservationResult.data[0] : null;
    }

    // console.log(JSON.stringify(reservData, null, '\t'));
    if(reservData == null){
        return next(new AppError('The reservation was not found!', 404));
    }

    const {_id, remailAddress, rfirstName, raddress, reservation,  thumbnailSmallUrl, thumbnailSmallFileType} = reservData;

    if(reservation == null || reservation?.reservationID == null || reservation.length <= 0){
        return next(new AppError('The reservation was not found!', 404));
    }

    const {reservationID, roomDetails, estimatedArrivalTime, priceBreakdown, paymentDetails, checkinDate, checkoutDate, mainGuest, specialRequest} = reservation;
    let status = reservation?.status;
    const {roomType, amenities, bedType, numberOfBeds, pricePerNight} = roomDetails;
    const {lastFour, billingAddress}= paymentDetails;

    const {totalCharge, totalPaid, fees, promotions} = priceBreakdown;

    const mappedFees = await Promise.all(fees.map(el=>{
        let obj = {};
        obj[el.name] = el.amount;
        return obj
    }));
    const mappedPromotions = await Promise.all(promotions.map(el=>{
        let obj = {};
        obj[el.name] = el.quantity;
        return obj
    }));

    const extraPersonFeeArr = fees.filter(el=>{return el.name === "Extra Person Fees"})
    const extraPersonFeeObj = extraPersonFeeArr.length > 0 ? extraPersonFeeArr[0] : null;
    const extraPersonFee = extraPersonFeeObj==null?0:extraPersonFeeObj.amount;
    const extraPersons = extraPersonFeeObj==null?0:extraPersonFeeObj.quantity;

    const taxesArr = fees.filter(el=>{return el.name === "HST"})
    const taxesObj = taxesArr.length > 0 ? taxesArr[0] : null;
    const taxes = taxesObj==null?0:taxesObj.amount;

    const nightlyRate = parseFloat(pricePerNight).toFixed(2)
    const totalNights = calculateDaysBetweenDates(checkinDate, checkoutDate);
    const subTotal = (pricePerNight * totalNights) + (extraPersonFee * extraPersons * totalNights)
    const bookingdata = {
        reservationID: reservationID,
        roomType: roomType,
        offers: amenities,
        bedType: bedType,
        bedCount: numberOfBeds,
        rate: nightlyRate,
        checkinDate: formatDate_Mon_DD_YYYY(checkinDate),
        checkoutDate: formatDate_Mon_DD_YYYY(checkoutDate),
        totalNights: totalNights,
        thumbnailSmall:`${process.env.AWS_ROOM_TYPE_IMAGE_URL}${thumbnailSmallUrl}`, 
        fileType: thumbnailSmallFileType,
        status: status, // to do compute based on date and label as no show
        guests: 3,
        estimatedArrivalTime: estimatedArrivalTime,
        cardType: "Mastercard",
        lastFour: lastFour,
        totalCharge: (parseFloat(totalCharge)).toFixed(2),
        totalPaid: (parseFloat(totalPaid)).toFixed(2),
        fees: mappedFees,
        promotions: mappedPromotions,
        totalDue: (totalCharge-totalPaid).toFixed(2),
        taxes: (parseFloat(taxes)).toFixed(2),
        subtotal: subTotal.toFixed(2),
        extraPersonFee: extraPersonFee*extraPersons,
        specialRequests: specialRequest,
        estimatedArrivalTime: estimatedArrivalTime,
        calendarCheckinDate: formatDate_YYY_d_MM_d_dd(checkinDate),
        calendarCheckoutDate: formatDate_YYY_d_MM_d_dd(checkoutDate),
    }
    const {
        firstName, lastName, mobileNumber, address, avatarPhotoUrl, emailAddress
    } = req.user;

    const guestInfo = {
        firstName: mainGuest==null ? firstName : mainGuest.firstName,
        lastName: mainGuest==null ? lastName : mainGuest.lastName,
        mobileNumber: mainGuest==null ? mobileNumber : mainGuest.mobileNumber,
        address: mainGuest==null ? address.address : mainGuest.address.address,
        city: mainGuest==null ? address.city : mainGuest.address.city,
        postalCode: mainGuest==null ? address.postalCode : mainGuest.address.postalCode,
        country: mainGuest==null ? address.country : mainGuest.address.country,
        isMainGuest: mainGuest==null ? "true" : "false"
    }

    const paymentInfo = {
        address: billingAddress == null ? address.address : billingAddress.address,
        city: billingAddress == null ? address.city : billingAddress.city,
        postalCode: billingAddress == null ? address.postalCode : billingAddress.postalCode,
        country: billingAddress == null ? address.country : billingAddress.country
    }

    const reservationReadOnly = (status !== "pending" || compareDates(compareDates(new Date(), checkinDate) > 0))

    if (status === "pending" && compareDates(compareDates(new Date(), checkinDate) > 0)){
        status = "no-show"
    }
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
    VB.addOptions("bookingData", bookingdata);
    VB.addOptions("guestInfo", guestInfo);
    VB.addOptions("paymentInfo", paymentInfo);
    VB.addOptions("reservationReadOnly", reservationReadOnly);
    VB.addOptions("status", status);
    res.render( "pages/hotelguest/reservation", VB.getOptions());
}