const ViewBuilder = require('./../apiUtils/viewBuilder')

exports.viewHomePage = (req, res, next) => {
    const VB = new ViewBuilder({
        alertToLogin: req?.alertToLogin??false,
        userType: req?.decoded?.type??null
    })
    res.render("pages/public/home", VB.getOptions());
}