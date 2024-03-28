const express = require('express');
const {logout} = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/logout')
  .get(logout);

module.exports = router;