const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder');
const AppError = require('./../../apiUtils/appError.js');

exports.loadStaffDashboard = catchAsync(async (req, res, next) => {
    if(req.user){
        const {firstName, lastName, mobileNumber, address, employeeType, emailAddress} = req.user;
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "dash.css");
        VB.addOptions("title", "Employee Dashboard");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"accountButtonList.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: employeeType,
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress
        });
        VB.addOptions("buttonData", [
            {name:"Respond to Inquiries",url:"/dashboard/staff/inquiries"},
            {name:"Browse Reservations",url:"/dashboard/staff/viewReservations"},
            {name:"Create Reservation",url:"/dashboard/staff/createReservations"}
        ]);
        res.render( "pages/employee/empDashboard", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})

exports.updateStaffPhoto = catchAsync(async (req, res, next) => {
    if(req.user){
        const {firstName, lastName, mobileNumber, address, employeeType, emailAddress} = req.user;
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "dash.css");
        VB.addOptions("title", "Edit Account");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: employeeType,
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress,
        });
        VB.addOptions("headerTitle", "Update Photo");
        res.render( "pages/employee/editAcc", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})

exports.editStaffAccount = catchAsync(async (req, res, next) => {
    if(req.user){
        const today = new Date();
        const dateString = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`
        const {firstName, lastName, mobileNumber, address, employeeType, emailAddress} = req.user;
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("date", dateString);
        VB.addOptions("css", "dash.css");
        VB.addOptions("title", "Edit Account");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: employeeType,
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress,
            editMode: true
        });
        VB.addOptions("headerTitle", "Edit Account Details");
        res.render( "pages/employee/editAcc", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
    
})

exports.editStaffPassword = catchAsync(async (req, res, next) => {
    if(req.user){
        const {firstName, lastName, mobileNumber, address, employeeType, emailAddress} = req.user;
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "dash.css");
        VB.addOptions("title", "Edit Account");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"h1styled.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: employeeType,
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress,
            editMode: true
        });
        VB.addOptions("headerTitle", "Update Password");
        res.render( "pages/employee/editAcc", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})


exports.viewInquiries = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/viewInquiries.css");
        VB.addOptions("title", "View Inquiries");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"}
        ]);
        res.render( "pages/employee/viewInquiries", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})


exports.createReservations = catchAsync(async (req, res, next) => {
    if(req.user){
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createReservation.css");
        VB.addOptions("title", "View Inquiries");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
            {name:"formContents.css"},
        ]);
        VB.addOptions("scripts", [
            {src:"/js/reservationinfo.js"},
        ]);
        VB.addOptions("addFlatPicker", true);
        VB.addOptions("bookingData", {
            checkinDate: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
            checkoutDate:  `${tomorrow.getFullYear()}-${tomorrow.getMonth()+1}-${tomorrow.getDate()}`,
        });
        res.render( "pages/employee/createReservation", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})

exports.checkin = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("title", "Checkin Guest");
        VB.addOptions("headerTitle", "Find Guests Checking-In Today");
        VB.addOptions("placeholder", "Search for a Guest");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/checkinTableButton.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"reservationNumber", label:"Reservation Number"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"arrivalTime", label: "Arrival Time"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/staff/checkin");

        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"reservationID", label:"Reservation #", isRow: true},
                {resultName:"checkinDate", label:"Check-in"},
                {resultName:"checkoutDate", label:"Check-out"},
                {resultName:"arrivalTime", label:"Arrival Time"},
                {resultName:"guestName", label:"Guest Name"},
                {resultName:"status", label:"Status"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-success", name: "Check-In"}, {classname:"btn-warning", name: "Check-out/Transfer"}, {classname:"btn-secondary", name: "View Status"}],
                        buttonActions: [{classname:"Checkin", name: "Check-In"}, {classname:"DisplayCheckoutTransfer", name: "Check-out/Transfer"}, {classname:"DisplayStatus", name: "View Status"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightorange", name: "View"}],
                        buttonActions: [{classname:'Redirect', name: "View"}],
                    }
                }
            ]
        });

        VB.addOptions("results", [
            {
                reservationID: "SDF4HN",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "16:30",
                guestName: "Alpha, Betty",
                status: "Check-out/Transfer",
                action1: "Check-out/Transfer",
                action2: "View",
                variableValues: {
                    reservationID: "SDF4HN",
                    status: "Check-out/Transfer"
                },
                variableName: "variableValues",
                sendvariableAsJSON: true
            },
            {
                reservationID: "DVHG80",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "18:00",
                guestName: "Mila, Waters",
                status: "Upcoming",
                action1: "Check-In",
                action2: "View",
                variableValues: {
                    reservationID: "SDF4HN",
                    status: "Upcoming"
                },
                variableName: "variableValues",
                sendvariableAsJSON: true
            },
            {
                reservationID: "DF8HTR",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "15:00",
                guestName: "Stephen, Carol",
                status: "Checked",
                action1: "Check-out/Transfer",
                action2: "View",
                variableValues: {
                    reservationID: "SDF4HN",
                    status: "Upcoming"
                },
                variableName: "variableValues",
                sendvariableAsJSON: true
            },
            {
                reservationID: "B7DFIG",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "16:00",
                guestName: "Jamima, Sean",
                status: "Upcoming",
                action1: "Check-In",
                action2: "View",
                variableValues: {
                    reservationID: "SDF4HN",
                    status: "Upcoming"
                },
                variableName: "variableValues",
                sendvariableAsJSON: true
            },
            {
                reservationID: "HJKS80",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "15:00",
                guestName: "Waters, Jameson",
                status: "Completed",
                action1: "View Status",
                action2: "View",
                variableValues: {
                    reservationID: "SDF4HN",
                    status: "Upcoming"
                },
                variableName: "variableValues",
                sendvariableAsJSON: true
            },
        ]);

        res.render( "pages/employee/viewList", VB.getOptions()); 
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})


exports.viewStaffReservations = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/viewReservations.css");
        VB.addOptions("title", "View Reservations");
        VB.addOptions("headerTitle", "Find a Reservation");
        VB.addOptions("placeholder", "Search for a Reservation");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts", [
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewReservationTableButtons.js"},
        ]);

        VB.addOptions("searchControlUrl", "/dashboard/staff/viewReservations");
        VB.addOptions("searchOptionsList", [
            {id:"reservationNumber", label:"Reservation Number"},
            {id:"lastName", label:"Last Name"},
            {id:"date", label: "Date"}
        ]);

        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"reservationID", label:"Reservation #", isRow: true},
                {resultName:"checkinDate", label:"Check-in"},
                {resultName:"checkoutDate", label:"Check-out"},
                {resultName:"guestName", label:"Guest Name"},
                {resultName:"status", label:"Status"},
                {resultName:"action", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "View/Modify"}, {classname:"btn-tab-lightorange", name: "View"}],
                        buttonActions: [{classname:'Redirect', name: "View/Modify"}, {classname:'Redirect', name: "View"}],
                    }
                }
            ]
        });

        VB.addOptions("results", [
            {
                reservationID: "ASD75HK",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Jenkins, Jenny",
                status: "Upcoming",
                action: "View/Modify",
                variableName: "url",
                url: '/dashboard/staff/reservation/ASD75HK'
            },
            {
                reservationID: "DF4HTS",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Simone, Lemone",
                status: "Completed",
                action: "View",
                variableName: "url",
                url: '/dashboard/staff/reservation/DF4HTS'
            },
            {
                reservationID: "SDF4HN",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Alpha, Betty",
                status: "Upcoming",
                action: "View/Modify",
                variableName: "url",
                url: '/dashboard/staff/reservation/SDF4HN'
            }
        ]);

        res.render( "pages/employee/viewList", VB.getOptions()); 
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})



exports.viewSingleReservationStafPOV = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
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
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})

exports.viewRoomOccupancy = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "roomOccupancy.css");
        VB.addOptions("title", "Room Occupancy Info");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ] );
        VB.addOptions("rooms", [
            {
                roomType: "Deluxe",
                roomId: "D100",
                bedType: "King",
                bedCount: 1,
                totalQuantity: 11,
                occupancy: 1,
                roomObjects: [
                    {
                        roomNumber: "101",
                        roomName: "The Presidential Suite",
                        guestId: "G001",
                        firstName: "John",
                        lastName: "Doe",
                        checkInDate: "2024-03-01",
                        checkOutDate: "2024-03-05"
                    },
                    {
                        roomNumber: "102",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "103",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "104",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "105",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "106",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "107",
                        roomName: "The Presidential Suite",
                        guestId: "G001",
                        firstName: "Jane",
                        lastName: "Doe",
                        checkInDate: "2024-03-01",
                        checkOutDate: "2024-03-05"
                    },
                    {
                        roomNumber: "108",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "109",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "110",
                        roomName: "The Royal Suite"
                    },
                    {
                        roomNumber: "111",
                        roomName: "The Royal Suite"
                    }
                ]
            },
            {
                roomType: "Queen",
                roomId: "D100",
                bedType: "King",
                bedCount: 1,
                totalQuantity: 2,
                occupancy: 1,
                roomObjects: [
                    {
                        roomNumber: "101",
                        roomName: "The Presidential Suite",
                        guestId: "G001",
                        firstName: "John",
                        lastName: "Doe",
                        checkInDate: "2024-03-01",
                        checkOutDate: "2024-03-05"
                    },
                    {
                        roomNumber: "102",
                        roomName: "The Royal Suite"
                    }
                ]
            },
        ]);
        res.render( "pages/employee/roomOccupancy",VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
})


