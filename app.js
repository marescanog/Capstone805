var express = require("express");
const exphbs = require("express-handlebars");
var path = require("path");
// const fs = require('fs');
const cookieParser = require('cookie-parser');

const AppError = require('./apiUtils/appError');
const globalErrorHandler = require('./controllers/errorController')
const reservationRouter = require('./routes/reservationRoutes');
const guestRouter = require('./routes/guestRoutes');
const employeeRouter = require('./routes/employeeRoutes');
const roomRouter = require('./routes/roomRoutes');
const contactFormRouter = require('./routes/contactFormRoutes');
const renderDashboardRouter = require('./routes/renderDashboardRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');
const publicRouter = require('./routes/publicRoutes');
const globalRouter = require('./routes/globalRouter');

var app = express();

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
        navHiddenLink: function(linkName, linkUrl, options){
            return `<li class="nav-item nav-show-small">
            <a class="dropdown-item nav-link" href="${linkUrl}">${linkName}</a>
            </li>`;
        },
        navHiddenLinkModal: function(modalIdName, linkName, options){
            return `<li class="nav-item nav-show-small">
            <a class="dropdown-item nav-link" data-bs-toggle="modal" data-bs-target="#${modalIdName}">${linkName}</a>
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
        isPropertyNull: function(object, property, options){
            return object[property] == null ? options.fn(this) : options.inverse(this);
        },
        isPropertyThere: function(object, property, options){
            return object[property] == null ?  options.inverse(this) :  options.fn(this);
        },
        getClassName: function(arr, object, property){
            const res = arr== null ? [] :arr.filter(el=>el.name === object[property]);
            return res.length > 0 ? res[0].classname : "";
        },
        concat: function() {
            return Array.prototype.slice.call(arguments, 0, -1).join('');
        },
        json: function (context) {
            return JSON.stringify(context);
        }
    }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

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

// 3 - ROUTES (Render Views)
app.use('/', publicRouter);
app.use('/dashboard', renderDashboardRouter);
app.use('/checkout', checkoutRouter);

// 4 - ROUTES (Api calls / Get JSON data)
app.use('/api/v1/', globalRouter);
app.use('/api/v1/guests', guestRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/contactFormSubmissions', contactFormRouter);


// 5 - No matching route
app.use((req, res, next) => {
    // render a better page
    res.render("pages/public/pagenotfound",{layout:"main"});
    // next(new AppError(`Page not Found!`, 404));
});
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// 5 - Global error Handling Middleware
app.use(globalErrorHandler)

module.exports = app;

