
const catchAsync = require('./../../apiUtils/catchAsync');
const ViewBuilder = require('./../../apiUtils/viewBuilder');
const AppError = require('./../../apiUtils/appError.js');

exports.loadAdminDashboard = catchAsync(async (req, res, next) => {
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
        VB.addOptions("title", "Admin Dashboard");
        VB.addOptions("partialsCSS", [,
            {name:"accountInfoSideBar.css"},
            {name:"accountButtonList.css"}
        ]);
        VB.addOptions("sidebarData", {
            img: "/img/placeholder/hotelstaff.png",
            firstName: firstName,
            lastName: `${lastName.charAt(0)}.`,
            employeeType: req?.decoded?.type,
            mobileNumber: mobileNumber,
            address: `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`,
            emailAddress: emailAddress
        });
        VB.addOptions("buttonData", [
            {name:"Manage Guests",url:"/dashboard/USNVMQD493/users"},
            {name:"Manage Employees",url:"#"},
            {name:"Manage Permissions",url:"#"}
        ]);
        VB.addOptions("scripts",[
            {src:"/js/managerDash.js"},
        ]);
        res.render( "pages/employee/empDashboard", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
} )

exports.viewUsers = catchAsync(async (req, res, next) => {
    res.render( "pages/employee/viewList",{ 
        layout:"main", 
        css: 'employee/checkin.css', 
        title:'View Guests',
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
})