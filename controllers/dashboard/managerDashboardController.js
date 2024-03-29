const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder')
 
exports.loadManagerDashboard = async (req, res) => {
    // if(req.user){
        // const {firstName, lastName, mobileNumber, address, employeeType, emailAddress} = req.user;
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
            // firstName: firstName,
            // lastName: `${lastName.charAt(0)}.`,
            employeeType: 'manager',
            // mobileNumber: mobileNumber,
            // address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            // emailAddress: emailAddress
        });
        VB.addOptions("buttonData", [
            {name:"Generate Report",url:"/dashboard/manager/dfgdfg"},
            {name:"Manage Promotions",url:"/dashboard/manager/promotions"},
            {name:"Manage Reservations",url:"/dashboard/staff/viewReservations"}
        ]);
        res.render( "pages/employee/empDashboard", VB.getOptions());
    // } else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
}

exports.viewOffers = async (req, res) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/checkin.css', 
        title:'View Offers',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ],
        scripts: [
            {src:"/js/searchControl.js"},
        ],
        searchOptionsList: [
            {id:"offerID", label:"Offer ID"},
            {id:"offerName", label:"Offer Name"},
            {id:"offerStartDate", label: "Offer Start"},
            {id:"createdOn", label: "Created On"}
        ],
        searchControlUrl: "/dashboard/manager/offers",
        results: [
            {
                offerID: "SDF4HN",
                createdOn: "March 16, 2024 Fri",
                offerName: "Welcome Drinks",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "Indefinate",
                roomsApplied: "All",
                action1: "Edit",
                action2: "Delete"
            },
            {
                offerID: "DFHEJ7",
                createdOn: "March 16, 2024 Fri",
                offerName: "Breakfast",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "March 16, 2025 Fri",
                roomsApplied: "All",
                action1: "Edit",
                action2: "Delete"
            },
            {
                offerID: "SDHFJ7",
                createdOn: "March 16, 2024 Fri",
                offerName: "Dinner",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "March 16, 2025 Fri",
                roomsApplied: "Queen",
                action1: "Edit",
                action2: "Delete"
            }
        ],
        tableOptions: {
            columns: [
                {resultName:"offerID", label:"Offer I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"offerName", label:"Offer Name"},
                {resultName:"offerStartDate", label:"Offer Start"},
                {resultName:"roomsApplied", label:"Rooms"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Delete"}],
                    }
                }
            ]
        },
        headerTitle:"Find Offers",
        placeholder:"Search for an Offer"
    }); 
}

exports.viewPromotions = async (req, res) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/checkin.css', 
        title:'View Promotions',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ],
        scripts: [
            {src:"/js/searchControl.js"},
        ],
        searchOptionsList: [
            {id:"promotionID", label:"Promo ID"},
            {id:"createdOn", label:"Created On"},
            {id:"startdate", label: "Promo Start"},
            {id:"name", label: "Promo Name"}
        ],
        searchControlUrl: "/dashboard/manager/promotions",
        results: [
            {
                promotionID: "SBD73I",
                createdOn: "March 16, 2024 Fri",
                name: "Free Champagne",
                startDate: "March 16, 2024 Fri",
                endDate: "March 16, 2025 Fri",
                description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos ",
                action1: "Edit",
                action2: "Delete",
            }
        ],
        tableOptions: {
            columns: [
                {resultName:"promotionID", label:"Promo I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"name", label:"Name"},
                {resultName:"startDate", label:"Promo Start"},
                {resultName:"endDate", label:"End Date"},
                {resultName:"description", label:"Description"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Delete"}],
                    }
                }
            ]
        },
        headerTitle:"Find Promotions",
        placeholder:"Search for a Promotion"
    }); 
}

exports.viewRooms = async (req, res) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/checkin.css', 
        title:'View Rooms',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ],
        scripts: [
            {src:"/js/searchControl.js"},
        ],
        searchOptionsList: [
            {id:"roomID", label:"Room ID"},
            {id:"roomType", label:"Room Type"},
            {id:"bedType", label: "Bed Type"},
            {id:"totalRooms", label: "Total Rooms"}
        ],
        searchControlUrl: "/dashboard/manager/rooms",
        results: [
            {
                roomID: "FFE4rtregdf",
                roomType: "Budget Single",
                bedType: "Single",
                totalRooms: "23",
                totaloccupied: "21",
                action1: "Edit"
            },
            {
                roomID: "asdasdsdad",
                roomType: "Deluxe",
                bedType: "Queen",
                totalRooms: "13",
                totaloccupied: "5",
                action1: "Edit"
            }
        ],
        tableOptions: {
            columns: [
                {resultName:"roomID", label:"Room I.D.", isRow: true},
                {resultName:"roomType", label:"Room Type"},
                {resultName:"bedType", label:"Bed Type"},
                {resultName:"totalRooms", label:"Total Rooms"},
                {resultName:"totaloccupied", label:"Total Occupied"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Edit"}],
                    }
                }
            ]
        },
        headerTitle:"Find Room Details",
        placeholder:"Search for a Room"
    }); 
}