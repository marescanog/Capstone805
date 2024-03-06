const express = require('express');
const router = express.Router();

router.get("/userdashboard", (req, res) => {
    res.render( "userdashboard");  // renders roomdetails
})

module.exports = router;