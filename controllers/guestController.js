const mongoose = require("mongoose");
const Guest = require("../models/guestModel.js");
const { Types } = mongoose;

exports.patchGuestAccountInfo = async (req, res) => {
    const { firstName, lastName, mobileNumber } = req.body;
  
    try {
        // return res.status(404).json(req.body);
      const guest = await Guest.findOneAndUpdate(
        { _id: req.params.id }, // Query criteria to find the guest by _id
        { firstName, lastName, mobileNumber },
        // { firstName:firstName }, // Updated data
        // { 
        //     firstName:firstName, 
        //     lastName:lastName, 
        //     address:address,
        //     mobileNumber:mobileNumber 
        // }, // Updated data
        { new: true },
      );
  
      if (!guest) {
        return res.status(404).json({ error: "Guest not found" });
      }
  
      res.status(200).json({ message: "Guest updated successfully", guest });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

exports.getAllGuests = async (req, res) => {
  try {
    // Query the database to fetch all guest records
    const guests = await Guest.find();

    res.status(200).json({
      status: "success",
      data: {
        guests,
      },
    });
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.find({_id: req.params.id});

    if (!guest) {
      return res.status(404).json({
        status: "error",
        message: "Guest user not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        guest,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
