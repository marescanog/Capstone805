const express = require('express');
const router = express.Router();

router.get("/updatepassword", (req, res) => {
    res.render( "updatepassword");  // renders roomdetails
})

module.exports = router;