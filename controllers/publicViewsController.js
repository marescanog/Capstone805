const catchAsync = require('../apiUtils/catchAsync');
const ViewBuilder = require('./../apiUtils/viewBuilder')
const {getAllRooms} = require('./roomController');

exports.viewHomePage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    })
    res.render("pages/public/home", VB.getOptions());
}

exports.viewAboutPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", "style.css");
    VB.addOptions("title", "About");
    VB.addOptions("members", [
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
    ]);
    res.render("pages/public/about", VB.getOptions());
}

exports.viewGuestRoomsPage = catchAsync( async (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });

    const roomTypeData = await getAllRooms(req, res, next);

    if(roomTypeData.status === "error"){
        return next(roomTypeData.data)
    }

    VB.addOptions("roomTypeData", roomTypeData.data);
    VB.addOptions("css", "./guest/guestRooms.css");
    VB.addOptions("title", "Guest Rooms");
    VB.addOptions("startURL", process.env.AWS_ROOM_TYPE_IMAGE_URL);
    res.render("pages/hotelguest/guestrooms", VB.getOptions());  
});

exports.vieRestaurantPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", 'restaurant.css');
    VB.addOptions("title", 'Restaurant');
    res.render("pages/public/restaurant",VB.getOptions());
}

exports.viewContactUsPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("title", 'Contact Us');
    res.render("pages/public/contactUs",VB.getOptions());
}

exports.viewRoomOffersPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", 'roomResults.css');
    VB.addOptions("title", 'Offers');
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ]);
    VB.addOptions("rooms", [
        {
            offer: '50%',
            name: "Queen",
            imageUrl: "https://hotel-prroject-room-photos.s3.ca-central-1.amazonaws.com/rooms/72196c538bc4a23a5e92938ea047bc3e00a2fbc7ac4f458e0e7f121c7f112a26.jpg",
            originalPrice: 500,
            discount_price: 440,
            savings: 60
        },
        {
            offer: '50%',
            name: "Queen",
            imageUrl: "https://hotel-prroject-room-photos.s3.ca-central-1.amazonaws.com/rooms/72196c538bc4a23a5e92938ea047bc3e00a2fbc7ac4f458e0e7f121c7f112a26.jpg",
            originalPrice: 500,
            discount_price: 440,
            savings: 60
        }
    ]);
    res.render("pages/public/roomResults",VB.getOptions());
}


exports.viewCreateAccountPage = (req, res, next) => {
    if(req?.decoded?.id){
        res.redirect(`/dashboard/guest/${req?.decoded?.id}`);
    } else {
        const VB = new ViewBuilder({
            alertToLogin: false,
            userType: null,
            id:null,
        });
        VB.addOptions("title", 'Create Account');
        VB.addOptions("css", 'createaccount.css');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ]);
        VB.addOptions("disablePaymentSidebar", true);
        VB.addOptions("center", true);
        res.render("pages/public/createaccount",VB.getOptions());
    }
}

exports.viewVerifyAccountPage = (req, res, next) => {
    if(req?.decoded?.id){
        res.redirect(`/dashboard/guest/${req?.decoded?.id}`);
    } else {
        // TODO Check if come from page createaccount
        // User should not be able to access this link just by typing the URL
        // Create cookie with email & expiry
        const VB = new ViewBuilder({
            alertToLogin: false,
            userType: null,
            id:null,
        });
        VB.addOptions("title", 'Verify Account');
        VB.addOptions("css", 'verifyCreateAccount.css');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ]);
        VB.addOptions("disablePaymentSidebar", true);
        VB.addOptions("center", true);
        VB.addOptions("scripts", [
            {src:"/js/utils/countdown.js"},
            {src:"/js/verifyEmail.js"},
        ]);
        VB.addOptions("serverSeconds", 60);
        res.render("pages/public/verifyCreateAccount",VB.getOptions());
    }
}

exports.viewEmployeePortalPage = (req, res, next) => {
    if(req?.decoded?.id){
        switch(req?.decoded?.type){
            case "staff":
                res.redirect(`/dashboard/staff/${req?.decoded?.id}`);
                break;
            case "manager":
                res.redirect(`/dashboard/manager/${req?.decoded?.id}`);
                break;
            case "admin":
                res.redirect(`/dashboard/USNVMQD493/${req?.decoded?.id}`);
                break;
            default:
                res.redirect(`/dashboard/guest/${req?.decoded?.id}`);
        }
    } else {
        const VB = new ViewBuilder({
            alertToLogin: req?.alertToLogin??false,
            userType: req?.decoded?.type??null,
            id:req?.decoded?.id??null,
        });
        VB.addOptions("css", 'employee/portal.css');
        VB.addOptions("title", 'Employee Portal');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"},
            {name:"employee/emploginform.css"}
        ]);
        VB.addOptions("headerTitle", "Employee Online Portal");
        VB.addOptions("formData", {
            staff: {
                desc1: "Welcome to the Hotel Employee Portal. Your gateway to seamless operations and exceptional guest experiences.",
                desc2: "Log in to make a difference!"
            },
            admin: {
                desc1: "Welcome to the Management Access Portal. Your control center for overseeing and optimizing the hotel website.",
                desc2: "Log in to unlock the full potential of your account management."
            }
        });
        VB.addOptions("scripts", [
            {src:"/js/loginStaff.js"},
        ]);
        res.render("pages/employee/portal",VB.getOptions());
    }
}


exports.viewFAQPage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    })
    VB.addOptions("css", 'faqsPolicies.cs');
    VB.addOptions("title", 'Faqs & Policies');
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ]);
    res.render("pages/public/faqsPolicies", VB.getOptions());
}