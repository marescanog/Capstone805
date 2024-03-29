const express = require('express');
const {logout, logoutRedirect} = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/logout')
  .get(logout);

router
.route('/logout/redirect')
.get(logoutRedirect);

module.exports = router;