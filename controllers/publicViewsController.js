const catchAsync = require('../apiUtils/catchAsync');
const ViewBuilder = require('./../apiUtils/viewBuilder')
const {getAllRooms, getValidRoomOffers} = require('./roomController');
const {isValidDate} = require('../models/modelUtils/utilityFunctions');
const AppError = require('./../apiUtils/appError.js');

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
    VB.addOptions("scripts", [
        {src:"/js/contactUs.js"},
    ]);
    res.render("pages/public/contactUs",VB.getOptions());
}

exports.viewCheckoutSessionExpiredRedirect = async (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    })
    VB.addOptions("headerTitle", 'Checkout Session Expired');
    VB.addOptions("scripts", [
        {src:"/js/checkoutExpired.js"},
    ]);
    res.render("pages/public/checkoutExpired", VB.getOptions());
}

exports.viewRoomOffersPage = catchAsync(async (req, res, next) => {

    let validOffersWithNull;
    const {guests, rooms} = req.query;
    let checkin =  req.query.checkin;
    let checkout = req.query.checkout;
    //YYYY-MM-DD
    if(checkin === 'today' || checkin == null || !(isValidDate(checkin))){
        const today = new Date();
        req.query.checkin = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        checkin =  req.query.checkin;
    }

    if(checkout === 'tomorrow' || checkout == null || !(isValidDate(checkout))){
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        req.query.checkout = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
        checkout = req.query.checkout;
    }

    try {
        validOffersWithNull = await getValidRoomOffers(req, res, next);
    } catch (err) {
        console.log(err);
        validOffersWithNull = [];
    }

    const validOffers = validOffersWithNull.filter(el=>el!=null && el.isValid);


    // console.log(JSON.stringify(validOffers[0].thumbNailLarge));


    // console.log(JSON.stringify(df[0].offer.offerCalendarImplementation))
    // console.log(df.length)

    // const roomResults =  [
    //     {
    //         offer: '50%',
    //         name: "Queen",
    //         imageUrl: "https://hotel-prroject-room-photos.s3.ca-central-1.amazonaws.com/rooms/72196c538bc4a23a5e92938ea047bc3e00a2fbc7ac4f458e0e7f121c7f112a26.jpg",
    //         originalPrice: 500,
    //         discount_price: 440,
    //         savings: 60
    //     },
    //     {
    //         offer: '50%',
    //         name: "Queen",
    //         imageUrl: "https://hotel-prroject-room-photos.s3.ca-central-1.amazonaws.com/rooms/72196c538bc4a23a5e92938ea047bc3e00a2fbc7ac4f458e0e7f121c7f112a26.jpg",
    //         originalPrice: 500,
    //         discount_price: 440,
    //         savings: 60
    //     }
    // ];

    // for Test
    // roomResults = [
    //     {
    //         thumbNail:validOffers[0].thumbNailLarge,
    //         roomType: "Deluxe Room",
    //         bedType: "Queen",
    //         bedCount: 1,
    //         baseAmenities: [
    //             {icon: "rooftop.svg", qty: 1, name:"rooftop"},
    //             {icon: "balcony.svg", qty: 1, name:"balcony"},
    //             {icon: "breakfast.svg", qty: 1, name:"breakfast"}
    //         ],
    //         hasBath: true,
    //         description: `Discover the perfect blend of luxury and convenience in our Deluxe Room, meticulously designed to provide an exceptional stay experience. This room is an ideal sanctuary for couples or solo travelers seeking a blend of comfort and sophistication. Anchored by a plush queen bed, the room invites relaxation and promises a restful night's sleep.
    //         Entertainment is never far with a state-of-the-art TV, allowing you to enjoy your favorite movies and shows in the comfort of your room. The dedicated desk space serves as a convenient spot for catching up on work or planning your adventures, ensuring productivity and leisure coexist harmoniously.
    //         The small pantry area is thoughtfully equipped with a mini-fridge, microwave, electric kettle, and coffee maker, offering the flexibility to prepare snacks or beverages whenever you desire. This personalized touch ensures that your cravings are catered to at all times.
    //         Elevate your relaxation routine in the sophisticated bathroom, featuring a luxurious bathtub with an integrated shower. This private retreat is designed for ultimate relaxation, allowing you to soak away the day's adventures or refresh and rejuvenate with a soothing shower.
    //         Our Deluxe Room encapsulates the essence of a premium stay, with every detail crafted to enhance your experience. From the sumptuous bedding to the convenience of in-room amenities, this room is a testament to the art of refined travel.`

    //     }
    // ];



    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null,
        id:req?.decoded?.id??null,
    });
    VB.addOptions("css", 'roomResults.css');
    VB.addOptions("title", 'Offers');
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"},
        {name:"calendarSearch.css"}
    ]);
    VB.addOptions("scripts", [
        {src:"/js/calendarSearch.js"},
    ]);
    VB.addOptions("addFlatPicker", true);
    // VB.addOptions("roomResults", roomResults); // test
    VB.addOptions("roomResults", validOffers); // prod
    VB.addOptions("checkin", checkin); 
    VB.addOptions("checkout", checkout); 
    VB.addOptions("guests", guests); 
    VB.addOptions("rooms", rooms); 
    res.render("pages/public/roomResults",VB.getOptions());
});


exports.viewCreateAccountPage = (req, res, next) => { 
    if(req?.decoded?.id){
        return res.redirect(`/dashboard/guest/${req?.decoded?.id}`);
    } else {
        const VB = new ViewBuilder({
            alertToLogin: false,
            userType: null,
            id:null,
        });
        VB.addOptions("NoHeaderSignup", true);
        VB.addOptions("justAddress", true);
        VB.addOptions("title", 'Create Account');
        VB.addOptions("css", 'createaccount.css');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ]);
        VB.addOptions("scripts", [
            {src:"/js/createAccount.js"},
        ]);
        VB.addOptions("disablePaymentSidebar", true);
        VB.addOptions("center", true);
        return res.render("pages/public/createaccount",VB.getOptions());
    }
}

exports.viewVerifyAccountPage = (req, res, next) => {
    if(req?.decoded?.id){
        return res.redirect(`/dashboard/guest/${req?.decoded?.id}`);
    } else {

        if (!req.session.createdAccount) {
            return res.redirect('/createaccount'); 
        }

        const serverSeconds = 60;

        const VB = new ViewBuilder({
            alertToLogin: false,
            userType: null,
            id:null,
        });
        VB.addOptions("NoHeaderSignup", true);
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
        VB.addOptions("serverSeconds", serverSeconds);
        VB.addOptions("emailSentTo", req.session.createdAccount);
        return res.render("pages/public/verifyCreateAccount",VB.getOptions());
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
    VB.addOptions("css", 'faqsPolicies.css');
    VB.addOptions("title", 'Faqs & Policies');
    VB.addOptions("partialsCSS", [
        {name:"h1styled.css"}
    ]);
    res.render("pages/public/faqsPolicies", VB.getOptions());
}


exports.viewForgotPasswordPage = (req, res, next) => {
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
            alertToLogin: false,
            userType: null,
            id:null,
        });
        VB.addOptions("title", 'Forgot Password');
        VB.addOptions("css", 'forgotpassword.css');
        VB.addOptions("partialsCSS", [
            {name:"h1styled.css"}
        ]);
        // VB.addOptions("center", true);
        VB.addOptions("scripts", [
            {src:"/js/forgotpassword.js"},
        ]);
        VB.addOptions("serverSeconds", 60);
        res.render("pages/public/forgotpassword",VB.getOptions());
    }
}

exports.viewRoomByIDWithOffer = catchAsync( async(req, res, next) => {
    const roomId = req.params.roomID;
    const offerId = req.params.offerID;

    // TODO add funtion in room controller get room by id and offer

    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
})

exports.viewRoomByID = catchAsync( async(req, res, next) => {
    const roomId = req.params.id;
    res.render( "pages/public/roomdetails", {
        layout:"main", 
        css: 'roomdetails.css', 
        title:'RoomDetails',
    });  
})