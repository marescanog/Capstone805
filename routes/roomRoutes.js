const express = require('express');
const {getAllRooms, getRoom, createRoom, updateRoom, renderAllRooms} = require('./../controllers/roomController.js');
const router = express.Router();

router
  .route('/')
  .get(renderAllRooms)
  .post(createRoom);

router
.route('/:id')
.get(getRoom)
.patch(updateRoom);

module.exports = router;