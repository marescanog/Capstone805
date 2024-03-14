
exports.loadStaffDashboard = async (req, res) => {
      res.render( "pages/employee/empDashboard",{ 
        layout:"main", 
        css: 'dash.css', 
        title:'Employee Dashboard',
        partialsCSS: [
            // {name:"h1styled.css"},
            {name:"accountInfoSideBar.css"},
            {name:"accountButtonList.css"}
        ],
        sidebarData : {
            img: "/img/placeholder/hotelstaff.png",
            firstName: "Shawna",
            lastName: "M.",
            employeeType: "Hotel Staff",
            mobileNumber: "499-999-999",
            address: "address, city, postal code, country",
            emailAddress: "shawnam@gmail.com"
        },
        buttonData: [
            {name:"Respond to Inquiries",url:""},
            {name:"Browse Reservations",url:""},
            {name:"Create Reservation",url:""}
        ]
    }); 
}

exports.viewStaffReservations = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The viewStaffReservations route is not yet defined!'
    });
}

exports.editStaffAccount = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The editStaffAccount route is not yet defined!'
    });
}

exports.editStaffPassword = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The editStaffPassword route is not yet defined!'
    });
}

exports.createReservations = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The createReservations route is not yet defined!'
    });
}

exports.viewInquiries = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The viewInquiries route is not yet defined!'
    });
}

exports.checkin = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The checkin route is not yet defined!'
    });
}

exports.updateStaffPhoto = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The updateStaffPhoto route is not yet defined!'
    });
}

