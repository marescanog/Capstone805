const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder');

exports.loadStaffDashboard = async (req, res) => {
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
        // redirect or something
    }
}

exports.updateStaffPhoto = async (req, res) => {
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
        // redirect or something
    }
}

exports.editStaffAccount = async (req, res) => {
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
        VB.addOptions("headerTitle", "Edit Account Details");
        res.render( "pages/employee/editAcc", VB.getOptions());
    } else {
        // redirect or something
    }
    
}

exports.editStaffPassword = async (req, res) => {
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
        // redirect or something
    }
}


exports.viewInquiries = async (req, res) => {
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
        // redirect or something
    }
}



exports.viewStaffReservations = async (req, res) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/viewReservations.css', 
        title:'View Reservations',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ],
        scripts: [
            {src:"/js/searchControl.js"},
        ],
        searchOptionsList: [
            {id:"reservationNumber", label:"Reservation Number"},
            {id:"lastName", label:"Last Name"},
            {id:"date", label: "Date"}
        ],
        searchControlUrl: "/dashboard/staff/viewReservations",
        results: [
            {
                reservationID: "ASD75HK",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Jenkins, Jenny",
                status: "Upcoming",
                action: "View"
            },
            {
                reservationID: "DF4HTS",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Simone, Lemone",
                status: "Completed",
                action: "Modify"
            },
            {
                reservationID: "SDF4HN",
                checkinDate: "Sep 7, 2024 Fri",
                checkoutDate: "10, 2024 Tuesday",
                guestName: "Alpha, Betty",
                status: "Upcoming",
                action: "View"
            }
        ],
        tableOptions: {
            columns: [
                {resultName:"reservationID", label:"Reservation #", isRow: true},
                {resultName:"checkinDate", label:"Check-in"},
                {resultName:"checkoutDate", label:"Check-out"},
                {resultName:"guestName", label:"Guest Name"},
                {resultName:"status", label:"Status"},
                {resultName:"action", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "View"}, {classname:"btn-tab-lightorange", name: "Modify"}],
                    }
                }
            ]
        },
        headerTitle:"Find a Reservation",
        placeholder:"Search for a Reservation"
    }); 
}

exports.checkin = async (req, res) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/checkin.css', 
        title:'Checkin Guest',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ],
        scripts: [
            {src:"/js/searchControl.js"},
        ],
        searchOptionsList: [
            {id:"reservationNumber", label:"Reservation Number"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"arrivalTime", label: "Arrival Time"}
        ],
        searchControlUrl: "/dashboard/staff/checkin",
        results: [
            {
                reservationID: "SDF4HN",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "16:30",
                guestName: "Alpha, Betty",
                status: "Upcoming",
                action: "Check-In"
            },
            {
                reservationID: "DVHG80",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "18:00",
                guestName: "Mila, Waters",
                status: "Upcoming",
                action: "Check-In"
            },
            {
                reservationID: "DF8HTR",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "15:00",
                guestName: "Stephen, Carol",
                status: "Checked",
                action: "View"
            },
            {
                reservationID: "B7DFIG",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "16:00",
                guestName: "Jamima, Sean",
                status: "Upcoming",
                action: "Check-In"
            },
            {
                reservationID: "HJKS80",
                checkinDate: "March 16, 2024 Fri",
                checkoutDate: "Sep 17, 2024 Tuesday",
                arrivalTime: "15:00",
                guestName: "Wtaers, Jameson",
                status: "Checked",
                action: "View"
            },
        ],
        tableOptions: {
            columns: [
                {resultName:"reservationID", label:"Reservation #", isRow: true},
                {resultName:"checkinDate", label:"Check-in"},
                {resultName:"checkoutDate", label:"Check-out"},
                {resultName:"arrivalTime", label:"Arrival Time"},
                {resultName:"guestName", label:"Guest Name"},
                {resultName:"status", label:"Status"},
                {resultName:"action", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Check-In"}, {classname:"btn-tab-lightorange", name: "View"}],
                    }
                }
            ]
        },
        headerTitle:"Find Guests Checking-In Today",
        placeholder:"Search for a Guest"
    }); 
}


exports.createReservations = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The createReservations route is not yet defined!'
    });
}





