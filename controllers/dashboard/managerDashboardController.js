
exports.loadManagerDashboard = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The loadManagerDashboard route is not yet defined!'
    });
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
        headerTitle:"Find User Accounts",
        placeholder:"Search for a User"
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
            {id:"accountID", label:"Account ID"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"createdOn", label: "Created On"}
        ],
        searchControlUrl: "/dashboard/USNVMQD493/users",
        results: [
            {
                accountID: "SDF4HN",
                createdOn: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                isVerified: "true",
                status: "active",
                userType: "Guest",
                action1: "Edit",
                action2: "Permissions",
                action3: "Delete"
            },
            {
                accountID: "DSADASDS",
                createdOn: "March 16, 2024 Fri",
                firstName: "Dean",
                lastName: "Marsano",
                isVerified: "true",
                status: "active",
                userType: "Manager",
                action1: "Edit",
                action2: "Permissions",
                action3: "Delete"
            }
        ],
        tableOptions: {
            columns: [
                {resultName:"accountID", label:"Accound I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"firstName", label:"First Name"},
                {resultName:"lastName", label:"Last Name"},
                {resultName:"status", label:"Status"},
                {resultName:"isVerified", label:"Verified"},
                {resultName:"userType", label:"User Type"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Permissions"}],
                    }
                },
                ,
                {resultName:"action3", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Delete"}],
                    }
                }
            ]
        },
        headerTitle:"Find User Accounts",
        placeholder:"Search for a User"
    }); 
}