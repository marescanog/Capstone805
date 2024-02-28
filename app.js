var express = require("express");
const exphbs = require("express-handlebars");
var path = require("path");

const reservationRouter = require('./routes/reservationRoutes');
const guestRouter = require('./routes/guestRoutes');
const roomRouter = require('./routes/roomRoutes');

const {renderAllRooms} = require('./controllers/roomController');

var app = express();

// Configure handlebars
app.engine('.hbs', exphbs.engine({
    extname:'.hbs',
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

app.get("/about", (req, res) => {
    res.render("about",{layout:"main"});
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

// 3 - ROUTES
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/rooms', roomRouter);

// 4 - No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

module.exports = app;

