const express = require('express');
const {getAllRooms, getRoom, createRoom, updateRoom} = require('./../controllers/roomController.js');
const router = express.Router();

router
  .route('/')
  .post(createRoom);

router
.route('/:id')
.get(getRoom)
.patch(updateRoom);

module.exports = router;