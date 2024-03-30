const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder')
 
exports.viewReportPage = async (req, res) => {
    if(req.user){
        const chartData = {
            labels: ['January', 'February', 'March', 'April'], // Example labels
            values: [10, 20, 30, 40] // Example data
          }
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "reports.css");
        VB.addOptions("title", "Reporting Tool");
        VB.addOptions("headerTitle", "Generate Report");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        VB.addOptions("addChartsJS", true);
        VB.addOptions("chartData", chartData);
        VB.addOptions("scripts",[
            {src:"/js/initChart.js"},
        ]);
        res.render( "pages/employee/manager/generateReport", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewCreateRoomPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "/employee/createRoom.css");
        VB.addOptions("title", "Create Room");
        VB.addOptions("headerTitle", "Create Room");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/createRoom.js"},
        ]);
        VB.addOptions("amenities", [
            "Microwave",
            "Balcony",
            "Pool",
        ]);
        VB.addOptions("priceChangeTrend", [
            {name: "Winter Trend", id:"asdasd", type:"type", value:"value"},
            {name: "Summer Trend", id:"asdasd", type:"type", value:"value"}
        ]);
        VB.addOptions("offers", [
            {name: "Breakfast", id:"asdasd", type:"type", value:"value"},
            {name: "Dinner", id:"asdasd", type:"type", value:"value"}
        ]);
        res.render( "pages/employee/manager/createRoom", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewRoomPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "/employee/createRoom.css");
        VB.addOptions("title", "View Room");
        VB.addOptions("readOnly", true);
        VB.addOptions("headerTitle", "View Room");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/createRoom.js"},
        ]);
        VB.addOptions("amenities", [
            "Microwave",
            "Balcony",
            "Pool",
        ]);
        VB.addOptions("priceChangeTrend", [
            {name: "Winter Trend", id:"asdasd", type:"type", value:"value"},
            {name: "Summer Trend", id:"asdasd", type:"type", value:"value"}
        ]);
        VB.addOptions("offers", [
            {name: "Breakfast", id:"asdasd", type:"type", value:"value"},
            {name: "Dinner", id:"asdasd", type:"type", value:"value"}
        ]);
        res.render( "pages/employee/manager/createRoom", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewCreateOfferPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "/employee/createOffer.css");
        VB.addOptions("title", "Create Offer");
        VB.addOptions("headerTitle", "Create Offer");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        // VB.addOptions("scripts",[
        //     {src:"/js/createRoom.js"},
        // ]);
        VB.addOptions("amenities", [
            "Welcome drinks",
            "microwave"
        ]);
        VB.addOptions("promotion", [
            {name: "Steakhouse Coupon", id:"asdasd", type:"type", value:"value"},
            {name: "Winter Discount", id:"asdasd", type:"type", value:"value"}
        ]);
        res.render( "pages/employee/manager/createOffer", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewOfferPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("readOnly", true);
        VB.addOptions("css", "/employee/createOffer.css");
        VB.addOptions("title", "View Offer");
        VB.addOptions("headerTitle", "View Offer");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        VB.addOptions("amenities", [
            "Welcome drinks",
            "microwave"
        ]);
        VB.addOptions("promotion", [
            {name: "Steakhouse Coupon", id:"asdasd", type:"type", value:"value"},
            {name: "Winter Discount", id:"asdasd", type:"type", value:"value"}
        ]);
        res.render( "pages/employee/manager/createOffer", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewCreatePromotionPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "/employee/createPromotion.css");
        VB.addOptions("title", "Create Promotion");
        VB.addOptions("headerTitle", "Create Promotion");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        res.render( "pages/employee/manager/createPromotion", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewPromotionPage = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("readOnly", true);
        VB.addOptions("css", "/employee/createPromotion.css");
        VB.addOptions("title", "Create Promotion");
        VB.addOptions("headerTitle", "Create Promotion");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
        ]);
        res.render( "pages/employee/manager/createPromotion", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}


exports.loadManagerDashboard = async (req, res) => {
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
        VB.addOptions("title", "Employee Dashboard");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"accountButtonList.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: 'manager',
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress
        });
        VB.addOptions("buttonData", [
            {name:"Generate Report",url:"/dashboard/manager/report"},
            {name:"Manage Promotions",url:"/dashboard/manager/promotions"},
            {name:"Manage Reservations",url:"/dashboard/staff/viewReservations"}
        ]);
        VB.addOptions("scripts",[
            {src:"/js/managerDash.js"},
        ]);
        res.render( "pages/employee/empDashboard", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewOffers = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("headerTitle", "Find Offers");
        VB.addOptions("placeholder", "Search for an Offer");
        VB.addOptions("title", "View Offers");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewOffersTableButtons.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"offerID", label:"Offer ID"},
            {id:"offerName", label:"Offer Name"},
            {id:"offerStartDate", label: "Offer Start"},
            {id:"createdOn", label: "Created On"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/manager/offers");
        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"offerID", label:"Offer I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"offerName", label:"Offer Name"},
                {resultName:"offerStartDate", label:"Offer Start"},
                {resultName:"roomsApplied", label:"Rooms"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-primary", name: "View/Edit"}],
                        buttonActions: [{classname:'Redirect', name: "View/Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-danger", name: "Delete"}],
                        buttonActions: [{classname:'Delete', name: "Delete"}],
                    }
                }
            ]
        });
        VB.addOptions("results",  [
            {
                offerID: "SDF4HN",
                createdOn: "March 16, 2024 Fri",
                offerName: "Welcome Drinks",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "Indefinate",
                roomsApplied: "All",
                action1: "View/Edit",
                action2: "Delete",
                variableName: "offerID"
            },
            {
                offerID: "DFHEJ7",
                createdOn: "March 16, 2024 Fri",
                offerName: "Breakfast",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "March 16, 2025 Fri",
                roomsApplied: "All",
                action1: "View/Edit",
                action2: "Delete",
                variableName: "offerID"
            },
            {
                offerID: "SDHFJ7",
                createdOn: "March 16, 2024 Fri",
                offerName: "Dinner",
                offerStartDate: "March 16, 2024 Fri",
                offerEndDate: "March 16, 2025 Fri",
                roomsApplied: "Queen",
                action1: "View/Edit",
                action2: "Delete",
                variableName: "offerID"
            }
        ]);
        res.render( "pages/employee/viewList", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewPromotions = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("headerTitle", "Find Promotions");
        VB.addOptions("placeholder", "Search for a Promotion");
        VB.addOptions("title", "View Promotions");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewPromotionsTableButtons.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"promotionID", label:"Promo ID"},
            {id:"createdOn", label:"Created On"},
            {id:"startdate", label: "Promo Start"},
            {id:"name", label: "Promo Name"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/manager/promotions");

        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"promotionID", label:"Promo I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"name", label:"Name"},
                {resultName:"startDate", label:"Promo Start"},
                {resultName:"endDate", label:"End Date"},
                {resultName:"description", label:"Description"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "View/Edit"}],
                        buttonActions: [{classname:'Redirect', name: "View/Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-danger", name: "Delete"}],
                        buttonActions: [{classname:'Delete', name: "Delete"}],
                    }
                }
            ]
        });
        VB.addOptions("results", [
            {
                promotionID: "SBD73I",
                createdOn: "March 16, 2024 Fri",
                name: "Free Champagne",
                startDate: "March 16, 2024 Fri",
                endDate: "March 16, 2025 Fri",
                description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos ",
                action1: "View/Edit",
                action2: "Delete",
                variableName: "promotionID"
            }
        ]);
        res.render( "pages/employee/viewList", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}

exports.viewRooms = async (req, res) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("headerTitle", "Find Room Details");
        VB.addOptions("placeholder", "Search for a Room");
        VB.addOptions("title", "View Rooms");
        VB.addOptions("partialsCSS", [,
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts",[
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewRoomTableButtons.js"},
        ]);

        VB.addOptions("searchOptionsList", [
            {id:"roomID", label:"Room ID"},
            {id:"roomType", label:"Room Type"},
            {id:"bedType", label: "Bed Type"},
            {id:"totalRooms", label: "Total Rooms"}
        ]);

        VB.addOptions("searchControlUrl", "/dashboard/manager/rooms");

        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"roomID", label:"Room I.D.", isRow: true},
                {resultName:"roomType", label:"Room Type"},
                {resultName:"bedType", label:"Bed Type"},
                {resultName:"totalRooms", label:"Total Rooms"},
                {resultName:"totaloccupied", label:"Total Occupied"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-primary", name: "View/Edit"}],
                        buttonActions: [{classname:'Redirect', name: "View/Edit"}],
                    }
                }
            ]
        });

        VB.addOptions("results", [
            {
                roomID: "FFE4rtregdf",
                roomType: "Budget Single",
                bedType: "Single",
                totalRooms: "23",
                totaloccupied: "21",
                action1: "View/Edit",
                variableName: "roomID"
            },
            {
                roomID: "asdasdsdad",
                roomType: "Deluxe",
                bedType: "Queen",
                totalRooms: "13",
                totaloccupied: "5",
                action1: "View/Edit",
                variableName: "roomID"
            }
        ]);

        res.render( "pages/employee/viewList", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
}