const express = require('express');
const router = express.Router();

router.get("/roomdetails", (req, res) => {
    res.render( "roomdetails");  // renders roomdetails
})

module.exports = router;
