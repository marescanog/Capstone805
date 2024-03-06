const express = require('express');
const router = express.Router();



router.get("/createaccount", (req, res) => {
    res.render( "createaccount");  // renders createAccount
})

module.exports = router;


