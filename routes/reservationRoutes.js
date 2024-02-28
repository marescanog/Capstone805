const express = require('express');
const {getAllReservations, createReservation, getReservation, updateReservation} = require('./../controllers/reservationController.js');
const reservationRouter = express.Router();

reservationRouter
  .route('/')
  .get(getAllReservations)
  .post(createReservation);

reservationRouter
.route('/:id')
.get(getReservation)
.patch(updateReservation);

module.exports = reservationRouter;