const {Room, photoSubSchema, amenitySubSchema, promotionsSubSchema, offerSubSchema, holdSubSchema} = require('./../models/roomModel');

exports.createRoom = async (req, res) => {
    try{

        const newRoom = await Room.create({
            ...req.body,
            "basePhotos":[],
            "baseAmenities":[],
            "offer":[],
            "hold":[]
        });
        
        res.status(201).json({
            status: 'success',
            data:{
                room: newRoom
            }
        });

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message:err
        });
    }
}

exports.getAllRooms = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getAllRooms route is not yet defined!'
    });
}

exports.renderAllRooms = async (req, res) => {
    try{
        // const rooms = await Room.find().lean();

        const rooms = await Room.aggregate([{$group:{_id:'$category',items:{$push:'$$ROOT'}}}]);

        // console.log(rooms)
        // console.log(JSON.stringify(rooms))
        res.render("pages/public/guestrooms", {layout:"main", rooms:rooms})

    } catch (err){
        res.status(400).json({
            status: 'fail',
            message:err
        });
    }
}

exports.getRoom = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The getRoom route is not yet defined!'
    });
}

exports.updateRoom = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The updateRoom route is not yet defined!'
    });
}
