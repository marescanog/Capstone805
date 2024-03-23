var express = require("express");
const exphbs = require("express-handlebars");
var path = require("path");
// const fs = require('fs');

const AppError = require('./apiUtils/appError');
const globalErrorHandler = require('./controllers/errorController')
const reservationRouter = require('./routes/reservationRoutes');
const guestRouter = require('./routes/guestRoutes');
const employeeRouter = require('./routes/employeeRoutes');
const roomRouter = require('./routes/roomRoutes');
const contactFormRouter = require('./routes/contactFormRoutes');
const renderDashboardRouter = require('./routes/renderDashboardRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');
const guestRooms = require('./routes/guestRoomRoutes');
// const createAccount = require('./routes/createaccount');
// const roomDetails = require('./routes/roomdetails');
// const userDashboard = require('./routes/userdashboard');
// const updatePassword = require('./routes/updatepassword');



// const header = fs.readFileSync('./views/layouts/header.hbs', 'utf8');

const {renderAllRooms} = require('./controllers/roomController');

var app = express();

// exphbs.registerPartial('header', header);


// Configure handlebars
app.engine('.hbs', exphbs.engine({
    extname:'.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        navLink: function(url, options){
            return `<li class="nav-item">
            <a class="nav-link ${url == app.locals.activeRoute ? "active" : "" }"
            href="${url}">${options.fn(this)}</a>
            </li>`;
        },
        navHiddenLink: function(functionName, options){
            return `<li class="nav-item nav-show-small">
            <a class="nav-link"
            href="#" onclick="${functionName}()"=>${options.fn(this)}</a>
            </li>`;
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        },
        notEqual: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue == rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        },
        equalOrGT: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue < rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        },
        isDevMode: function() {
            if(process?.env?.NODE_ENV === 'development'){
                return `<li class="nav-item">
                <a class="nav-link ${"/devlinks" == app.locals.activeRoute ? "active" : "" }"
                href="/devlinks">DEVLINKS</a>
                </li>`
            }
        },
        getProperty: function(object, property){
            return object[property];
        },
        getClassName: function(arr, object, property){
            const res = arr== null ? [] :arr.filter(el=>el.name === object[property]);
            return res.length > 0 ? res[0].classname : "";
        }
    }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

// adds activeRoute property your app.locals
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/,"") : route.replace(/\/(.*)/,""));
    next();
})

app.get("/", (req, res) => {
    res.render("pages/public/home",{layout:"main"});
});

app.get("/home", (req, res) => {
    res.render("pages/public/home",{layout:"main"});
});
app.get("/guestrooms", (req, res) => {   
    res.render("pages/hotelguest/guestrooms");  // renders roomdetails
})

app.get("/about", (req, res) => {
    const memberData = [
        {
            name: 'Marvie Gastaya',
            imageUrl: "/img/about/marvie.png",
            position:"Project Leader Database application developer",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
        },
        {
            name: 'Nischal Sapkota',
            imageUrl: "/img/about/nishchal.png",
            position:"Database application developer",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
        },
        {
          name: 'Sanam Maharjan',
          imageUrl: "/img/about/sanam.png",
          position:"Database application developer",
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
      },
      {
          name: 'Taslima Parvin',
          imageUrl: "/img/about/taslima.png",
          position:"Database application developer",
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
      },
    ];
    const hotelStory = "Here you can provide some text about the hotel's history, vision, and values...";
    res.render("pages/public/about",{ 
        layout:"main", 
        css: 'style.css', 
        title:'About',
        members: memberData,
        story: hotelStory
    });
});

// app.get("/guestrooms", (req, res) => {
//     renderAllRooms(req, res);
// });

app.get("/restaurant", (req, res) => {
    res.render("pages/public/restaurant",{layout:"main"});
});

app.get("/contactUs", (req, res) => {
    res.render("pages/public/contactUs",{layout:"main"});
});

app.get("/createaccount", (req, res) => {
    res.render( "pages/public/createaccount", { 
        layout:"main", 
        css: 'createaccount.css', 
        title:'Create Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ],
        disablePaymentSidebar: true,
        center: true
    });  
})

app.get("/editaccount", (req, res) => {
    res.render( "pages/hotelguest/editAccount", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'edit account',
    });  
})
app.get("/roomdetails", (req, res) => {
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
})
app.get("/royaltyhistory", (req, res) => {
    res.render( "pages/hotelguest/royaltyHistory", {
        layout:"main", 
        css: 'editaccount.css', 
        title:'royalty History',
    });  
})

// DELETE this route LATER SINCE ROUTE IS NOW /dashboard/guest/sdf
app.get("/userdashboard", (req, res) => {
    res.render( "pages/hotelguest/userdashboard", {
        layout:"main", 
        title:'Profile',  
    });  
})

app.get("/updatepassword", (req, res) => {
    res.render( "pages/hotelguest/updatepassword");  
})

// we can organize routes later like below for now we'll just write everthing in app.js
// we will refactor later

app.get("/devlinks", (req, res) => {
    res.render( "pages/public/devlinks");  
})

app.get("/reservations", (req, res) => {
    res.render( "pages/hotelguest/reservationList",{ 
        layout:"main", 
        css: 'guest/reservationList.css', 
        title:'Reservations',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
})

app.get("/loyalty", (req, res) => {
    res.render( "pages/hotelguest/loyalty",{ 
        layout:"main", 
        css: 'guest/loyalty.css', 
        title:'Loyalty history',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
})

app.get("/editaccount", (req, res) => {
    res.render( "pages/hotelguest/editAccount",{ 
        layout:"main", 
        css: 'guest/editaccount.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});

app.get("/update-email", (req, res) => {
    res.render( "pages/hotelguest/update-email",{ 
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});

app.get("/view-inquiries", (req, res) => {

    const inquiries = [
        { title: 'Will the spa be', detail: 'Will the spa be open till mid night.' },
        { title: 'Is room service', detail: 'Is room service available in single rooms ' },
        { title: 'Is there any', detail: 'Is there any option to book hotel car service' },
        // Add more inquiries as needed
    ];

    res.render( "pages/hotelguest/view-inquiries",{ 
        inquiries : inquiries,
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ] 
    });  
});


// Handle the form submission
// Note we werent supposed to make apis yet, just the frontend
// Edit this out later
app.post('/submit-feedback', (req, res) => {
    console.log(req.body); // Log the form data to the console
    res.send('Thank you for your feedback!'); // Send a response to the client
});
// Note again we werent supposed to make apis yet, just the frontend
// Edit this out later
// Handle the form submission for updating email
app.post('/submit-new-email', (req, res) => {  
    res.render( "pages/hotelguest/update-email",{ 
        layout:"main", 
        css: 'style.css', 
        title:'Edit Account',
        partialsCSS: [
            {name:"h1styled.css"}
        ],
        successMessage: 'Your email has been updated.'
    });  
});


app.get("/portal", (req, res) => {
    res.render( "pages/employee/portal",{ 
        layout:"main", 
        css: 'employee/portal.css', 
        title:'Employee Portal',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"employee/emploginform.css"}
        ],
        headerTitle: "Employee Online Portal",
        formData : {
            staff: {
                desc1: "Welcome to the Hotel Employee Portal. Your gateway to seamless operations and exceptional guest experiences.",
                desc2: "Log in to make a difference!"
            },
            admin: {
                desc1: "Welcome to the Admin Portal. Your control center for overseeing and optimizing user accounts within the hotel.",
                desc2: "Log in to unlock the full potential of your account management."
            }
        }
    }); 
});

app.get("/verifyaccount", (req, res) => {
    res.render( "pages/public/verifyCreateAccount", { 
        layout:"main", 
        css: 'verifyCreateAccount.css', 
        title:'Verify Account',
        partialsCSS: [
            {name:"h1styled.css"},
            {name:"paymentSidebar.css"},
        ] ,
        disablePaymentSidebar: true,
        center: true,
        scripts: [
            {src:"/js/utils/countdown.js"},
            {src:"/js/verifyEmail.js"},
        ],
        serverSeconds: 60
    });  
})

app.post("/createaccount", (req, res) => {
    res.redirect('/verifyaccount');
}
);

app.get("/reservationinfo/:id", (req, res) => {
    res.render( "pages/hotelguest/reservation",{ 
        layout:"main", 
        css: 'createaccount.css', 
        title:'Reservation',
        partialsCSS: [
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"},
            {name:"formContents.css"},
        ] ,
        scripts: [
            {src:"/js/reservationinfo.js"},
        ],
        disablePaymentSidebar: false,
        addFlatPicker: true,
        userData: {
            firstName: "John",
            lastName: "Doe",
        },
        bookingData: {
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
        }
    });  
})

app.post("/createReservation", (req, res) => {
    // console.log(JSON.stringify(req.body))
    // res.send(req.body)
    try {
        res.json({ success: true, message: "Reservation created successfully!" });
    } catch (error){
        console.error("Save failed:", error);
        res.json({ success: false, message: "Failed to create reservation. Please try again." });
    }
})



// 3 - ROUTES
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/contactFormSubmissions', contactFormRouter);
app.use('/dashboard', renderDashboardRouter);
app.use('/checkout', checkoutRouter);
app.use('/guestrooms',guestRooms);
// app.use('/createaccount', createAccount);
// app.use('/roomdetails', roomDetails);
// app.use('/userdashboard', userDashboard);
// app.use('/updatepassword', updatePassword);



// 4 - No matching route
app.use((req, res) => {
    next(new AppError(`Page not Found!`, 404));
});

app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// 5 - Global error Handling Middleware
app.use(globalErrorHandler)

module.exports = app;

