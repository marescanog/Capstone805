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
        isDevMode: function() {
            if(process?.env?.NODE_ENV === 'development'){
                return `<li class="nav-item">
                <a class="nav-link ${"/devlinks" == app.locals.activeRoute ? "active" : "" }"
                href="/devlinks">DEVLINKS</a>
                </li>`
            }
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

app.get("/about", (req, res) => {
    res.render("pages/public/about",{layout:"main"});
});

app.get("/guestrooms", (req, res) => {
    renderAllRooms(req, res);
});

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
            {name:"paymentSidebar.css"},
            {name:"h1styled.css"}
        ] 
    });  
})

app.get("/roomdetails", (req, res) => {
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
})

app.get("/userdashboard", (req, res) => {
    res.render( "pages/hotelguest/userdashboard", {
        layout:"main", 
        title:'Profile',  
    });  
})

app.get("/updatepassword", (req, res) => {
    res.render( "pages/hotelguest/updatepassword");  
})

app.get("/devlinks", (req, res) => {
    res.render( "pages/public/devlinks");  
})

// we can organize routes later like below for now we'll just write everthing in app.js
// we will refactor later

app.get("/devlinks", (req, res) => {
    res.render( "pages/public/devlinks");  
})

app.get("/reservations", (req, res) => {
    res.render( "pages/hotelguest/reservations",{ 
        layout:"main", 
        css: 'guest/reservations.css', 
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
})


// 3 - ROUTES
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/rooms', roomRouter);
// app.use('/createaccount', createAccount);
// app.use('/roomdetails', roomDetails);
// app.use('/userdashboard', userDashboard);
// app.use('/updatepassword', updatePassword);



// 4 - No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

module.exports = app;

