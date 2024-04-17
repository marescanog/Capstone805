const express = require('express');
const {logout, logoutRedirect, activateAccount, requestActivationResetCode} = require('./../controllers/authController.js');
const router = express.Router();

router
  .route('/logout')
  .get(logout);

router
.route('/logout/redirect')
.get(logoutRedirect);

router
.route('/requestResendActivationCode')
.post(requestActivationResetCode);

router
.route('/sendActivationCode')
.post(activateAccount);

module.exports = router;