const express = require('express');
const router = express.Router();

router.get("/editaccount", (req, res) => {
    res.render( "editAccount");  // renders edit Accouunt
})

module.exports = router;
