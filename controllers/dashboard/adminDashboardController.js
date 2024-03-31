
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
            {name:"Manage Employees",url:"/dashboard/USNVMQD493/employees"},
            {name:"Manage Permissions",url:"/dashboard/USNVMQD493/managepermissions"}
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
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("title", "View Guests");
        VB.addOptions("headerTitle", "Find User Accounts");
        VB.addOptions("placeholder", "Search for a User");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts", [
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewUsersTableButtons.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"accountID", label:"Account ID"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"createdOn", label: "Created On"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/USNVMQD493/users");
    
        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"accountID", label:"Accound I.D.", isRow: true},
                {resultName:"createdOn", label:"Created On"},
                {resultName:"firstName", label:"First Name"},
                {resultName:"lastName", label:"Last Name"},
                {resultName:"status", label:"Status"},
                {resultName:"isVerified", label:"Verified"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "View/Edit"}],
                        buttonActions: [{classname:'Redirect', name: "View/Edit"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-warning", name: "Permissions"}],
                        buttonActions: [{classname:'Permission', name: "Permissions"}],
                    }
                },
                ,
                {resultName:"action3", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-danger", name: "Delete"}],
                        buttonActions: [{classname:'Delete', name: "Delete"}],
                    }
                }
            ]
        });
        VB.addOptions("results", [
            {
                accountID: "SDF4HN",
                createdOn: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                isVerified: "true",
                status: "active",
                action1: "View/Edit",
                action2: "Permissions",
                action3: "Delete",
                variableName: "accountID"
            },
            {
                accountID: "DSADASDS",
                createdOn: "March 16, 2024 Fri",
                firstName: "Dean",
                lastName: "Marsano",
                isVerified: "true",
                status: "active",
                action1: "View/Edit",
                action2: "Permissions",
                action3: "Delete",
                variableName: "accountID"
            }
        ]);
        res.render( "pages/employee/viewList", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
    
});


exports.viewEmployees = catchAsync(async (req, res, next) => {
    if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/checkin.css");
        VB.addOptions("title", "View Employees");
        VB.addOptions("headerTitle", "Find Employee Accounts");
        VB.addOptions("placeholder", "Search for an Employee");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"}
        ]);
        VB.addOptions("scripts", [
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/viewEmployeesTableButtons.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"accountID", label:"Account ID"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"hiredDate", label: "Hire Date"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/USNVMQD493/users");
    
        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"accountID", label:"Accound I.D.", isRow: true},
                {resultName:"hiredDate", label:"Hire Date"},
                {resultName:"firstName", label:"First Name"},
                {resultName:"lastName", label:"Last Name"},
                {resultName:"status", label:"Status"},
                {resultName:"userType", label:"User Type"},
                {resultName:"action1", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Edit/View"}],
                        buttonActions: [{classname:'Redirect', name: "Edit/View"}],
                    }
                },
                {resultName:"action2", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-warning", name: "Permissions"}],
                        buttonActions: [{classname:'Permission', name: "Permissions"}],
                    }
                },
                {resultName:"action3", label:"Action", 
                    isButton: { 
                        classNames: [{classname:"btn-danger", name: "Delete"}],
                        buttonActions: [{classname:'Delete', name: "Delete"}],
                    }
                }
            ]
        });
        VB.addOptions("results", [
            {
                accountID: "SDF4HN",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                status: "active",
                userType: "Staff",
                action1: "Edit/View",
                action2: "Permissions",
                action3: "Delete",
                variableName: "accountID"
            },
            {
                accountID: "DSADASDS",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Dean",
                lastName: "Marsano",
                status: "active",
                userType: "Manager",
                action1: "Edit/View",
                action2: "Permissions",
                action3: "Delete",
                variableName: "accountID"
            }
        ]);
        res.render( "pages/employee/viewList", VB.getOptions());
    } else {
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
});

exports.createUserPage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("title", "Create Guest Account");
        VB.addOptions("headerTitle", "Create Guest Account");
        res.render( "pages/employee/admin/createUser", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});

exports.viewUserPage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("readOnly", true);
        VB.addOptions("title", "View Guest Account");
        VB.addOptions("headerTitle", "View Guest Account");
        res.render( "pages/employee/admin/createUser", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});

exports.createEmployeePage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("title", "Create Employee Account");
        VB.addOptions("headerTitle", "Create Employee Account");
        res.render( "pages/employee/admin/createEmployee", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});

exports.viewEmployeePage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("readOnly", true);
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("title", "View Employee Account");
        VB.addOptions("headerTitle", "View Employee Account");
        res.render( "pages/employee/admin/createEmployee", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});

exports.managePermissionsPage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("title", "Manage Permissions");
        VB.addOptions("headerTitle", "Manage Permissions");
        res.render( "pages/employee/admin/manageUser", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});

exports.managePermissionsSearchPage = catchAsync(async (req, res, next) => {
    // if(req.user){
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", "employee/createforms.css");
        VB.addOptions("title", "Manage Permissions");
        VB.addOptions("headerTitle", "Manage Permissions");
        VB.addOptions("placeholder", "Search for an Employee");
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"search.css"},
            {name:"table.css"},
        ]);
        VB.addOptions("scripts", [
            {src:"/js/searchControl.js"},
            {src:"/js/tableButtonFunc/managePermissionsTableButtons.js"},
        ]);
        VB.addOptions("searchOptionsList", [
            {id:"accountID", label:"Account ID"},
            {id:"lastName", label:"Last Name"},
            {id:"firstName", label: "First Name"},
            {id:"createdOn", label: "Created On"},
            {id:"userType", label: "User Type"}
        ]);
        VB.addOptions("searchControlUrl", "/dashboard/USNVMQD493/managepermissions");
    
        VB.addOptions("tableOptions", {
            columns: [
                {resultName:"accountID", label:"Accound I.D.", isRow: true},
                {resultName:"hiredDate", label:"Hire Date"},
                {resultName:"firstName", label:"First Name"},
                {resultName:"lastName", label:"Last Name"},
                {resultName:"status", label:"Status"},
                {resultName:"userType", label:"User Type"},
                {resultName:"action1", label:"Permissions", 
                    isButton: { 
                        classNames: [{classname:"btn-success", name: "Modify Permissions"}],
                        buttonActions: [{classname:'Redirect', name: "Modify Permissions"}],
                    }
                },
                {resultName:"action2", label:"Pass Reset", 
                    isButton: { 
                        classNames: [{classname:"btn-warning", name: "Pass Reset"}],
                        buttonActions: [{classname:'PassReset', name: "Pass Reset"}],
                    }
                },
                {resultName:"action3", label:"Code Reset", 
                    isButton: { 
                        classNames: [{classname:"btn-tab-lightblue", name: "Code Reset"}],
                        buttonActions: [{classname:'CodeReset', name: "Code Reset"}],
                    }
                },
                {resultName:"action4", label:"Send Link", 
                    isButton: { 
                        classNames: [{classname:"btn-warning", name: "Activation Link"}],
                        buttonActions: [{classname:'ActivationLink', name: "Activation Link"}],
                    }
                },
                {resultName:"action5", label:"Deactivate", 
                    isButton: { 
                        classNames: [{classname:"btn-danger", name: "Deactivate"}],
                        buttonActions: [{classname:'Deactivate', name: "Deactivate"}],
                    }
                },
            ]
        });
        VB.addOptions("results", [
            {
                accountID: "SDF4HN",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                status: "active",
                userType: "Staff",
                action1: "Modify Permissions",
                action2: "Pass Reset",
                action3: "Code Reset",
                action4: "Activation Link",
                action5: "Deactivate",
                variableName: "accountID"
            },
            {
                accountID: "SDF4HN",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                status: "active",
                userType: "Guest",
                action1: "Modify Permissions",
                action2: "Pass Reset",
                action3: null,
                action4: null,
                action5: "Deactivate",
                variableName: "accountID"
            },
            {
                accountID: "SDF4HN",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                status: "active",
                userType: "Manager",
                action1: "Modify Permissions",
                action2: "Pass Reset",
                action3: "Code Reset",
                action4: null,
                action5: "Deactivate",
                variableName: "accountID"
            },
            {
                accountID: "SDF4HN",
                hiredDate: "March 16, 2024 Fri",
                firstName: "Gary",
                lastName: "Lee",
                status: "active",
                userType: "Admin",
                action1: "Modify Permissions",
                action2: "Pass Reset",
                action3: null,
                action4: null,
                action5: "Deactivate",
                variableName: "accountID"
            },
        ]);
        res.render( "pages/employee/admin/manageUserSearch", VB.getOptions());
    // }else {
    //     return next(new AppError('You are not logged in! Please login to get access.', 401));
    // }
});
