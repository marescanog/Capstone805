const express = require('express');
const router = express.Router();



router.get("/guestrooms", (req, res) => {
    res.render( "guestrooms");  // renders createAccount
})

module.exports = router;


