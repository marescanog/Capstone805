const express = require('express');
const router = express.Router();

router.get("/royaltyhistory", (req, res) => {
    res.render( "royaltyHistory");  // renders royaltyHistory
})

module.exports = router;
