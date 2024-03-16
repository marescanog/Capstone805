
exports.loadAdminDashboard = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The loadAdminDashboard route is not yet defined!'
    });
}

exports.viewUsers = async (req, res) => {
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
}