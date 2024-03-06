var express = require("express");
const exphbs = require("express-handlebars");
var path = require("path");
// const fs = require('fs');

const reservationRouter = require('./routes/reservationRoutes');
const guestRouter = require('./routes/guestRoutes');
const roomRouter = require('./routes/roomRoutes');
const createAccount = require('./routes/createaccount');
const roomDetails = require('./routes/roomdetails');
const userDashboard = require('./routes/userdashboard');
const updatePassword = require('./routes/updatepassword');



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
    }
}));

app.set('view engine', '.hbs');

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
    res.render("home",{layout:"main"});
});

app.get('/about', (req, res) => {

  
    const memberData = [
        {
            name: 'Marvie Gastaya',
            imageUrl: "/images/marvie.png",
            position:"Project Leader Database application developer",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
        },
        {
            name: 'Nischal Sapkota',
            imageUrl: "/images/nishchal.png",
            position:"Database application developer",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
        },
        {
          name: 'Sanam Maharjan',
          imageUrl: "/images/sanam.png",
          position:"Database application developer",
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
      },
      {
          name: 'Taslima Parvin',
          imageUrl: "/images/taslima.png",
          position:"Database application developer",
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa. Gravida arcu ac tortor dignissim convallis aenean et tortor. Sed libero enim sed faucibus turpis. Netus et malesuada fames ac turpis egestas. Vulputate ut pharetra sit amet aliquam id. Rutrum quisque non tellus orci. Risus nullam eget felis eget nunc lobortis mattis. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Tempus iaculis urna id volutpat. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Vel facilisis volutpat est velit egestas dui. Justo donec enim diam vulputate ut pharetra sit. Ac tincidunt vitae semper quis lectus nulla at'
      },
    ];
  
    const hotelStory = "Here you can provide some text about the hotel's history, vision, and values...";
  
      res.render('about-us', {
          members: memberData,
          story: hotelStory // Add this line to pass the hotel story to your template
      });
  });

app.get("/guestrooms", (req, res) => {
    renderAllRooms(req, res);
});

app.get("/restaurant", (req, res) => {
    res.render("restaurant",{layout:"main"});
});

app.get("/contactUs", (req, res) => {
    res.render("contactUs",{layout:"main"});
});

<<<<<<< HEAD
app.get("/createaccount", (req, res) => {
    res.render( "createaccount");  // renders createAccount
})

app.get("/roomdetails", (req, res) => {
    res.render( "roomdetails");  // renders roomdetails
})
app.get("/userdashboard", (req, res) => {
    res.render( "userdashboard");  // renders roomdetails
})
app.get("/updatepassword", (req, res) => {
    res.render( "updatepassword");  // renders roomdetails
})
=======
app.get('/view-inquiries', (req, res) => {
    const inquiries = [
        { title: 'Will the spa be', detail: 'Will the spa be open till mid night.' },
        { title: 'Is room service', detail: 'Is room service available in single rooms ' },
        { title: 'Is there any', detail: 'Is there any option to book hotel car service' },
        // Add more inquiries as needed
    ];

    res.render('view-inquiries', { inquiries });
});

// Display the form for updating email
app.get('/update-email', (req, res) => {
    res.render('update_email');
});

// Handle the form submission for updating email
app.post('/submit-new-email', (req, res) => {
    // your code
    res.render('update-email', { successMessage: 'Your email has been updated.' }); // Again, use a hyphen here.
});
>>>>>>> 8949f5d90fba4a995e28171754a832b548bd001b

// 3 - ROUTES
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/createaccount', createAccount);
app.use('/roomdetails', roomDetails);
app.use('/userdashboard', userDashboard);
app.use('/updatepassword', updatePassword);




const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Handle the form submission
app.post('/submit-feedback', (req, res) => {
    console.log(req.body); // Log the form data to the console
    res.send('Thank you for your feedback!'); // Send a response to the client
});

// 4 - No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

module.exports = app;

