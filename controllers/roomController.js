const {Room, photoSubSchema, amenitySubSchema, promotionsSubSchema, offerSubSchema, holdSubSchema} = require('./../models/roomModel');
const catchAsync = require('./../apiUtils/catchAsync');
const AppError = require('../apiUtils/appError');

exports.createRoom = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'The createRoom route is not yet defined!'
    });
    // try{

    //     const newRoom = await Room.create({
    //         ...req.body,
    //         "basePhotos":[],
    //         "baseAmenities":[],
    //         "offer":[],
    //         "hold":[]
    //     });
        
    //     res.status(201).json({
    //         status: 'success',
    //         data:{
    //             room: newRoom
    //         }
    //     });

    // }catch(err){
    //     res.status(400).json({
    //         status: 'fail',
    //         message:err
    //     });
    // }
}

exports.getAllRooms = async () => {
    try{
        const rooms = await Room.aggregate([
            {
                $project: {
                    _id: 1, 
                    description: 1,
                    thumbNail: 1,
                    roomType: 1,
                    category: 1,
                    bedType: 1,
                    bedCount: 1,
                }
            },
            {$group:{_id:'$category',items:{$push:'$$ROOT'}}}
        ]);
        return new Promise((resolve)=>{
            resolve({
                status: 'success',
                statusCode: 200,
                data: rooms
            });
        })
    } catch (err) {
        return {
            status: 'error',
            statusCode: 500,
            data: new AppError(err, 500)
        }
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


exports.getValidRoomOffers = async (req, res, next) => {

    const {checkin, checkout, guests, rooms} = req.query;

    console.log(`checkin: ${checkin}`);
    console.log(`checkout: ${checkout}`);
    console.log(`guests: ${guests}`);
    console.log(`rooms: ${rooms}`);
    
    const today = process?.env?.SERVER_DATE && process?.env?.SERVER_DATE != 'null' ? new Date(process?.env?.SERVER_DATE) : new Date();

    const pipeline = [
        {
          $unwind: '$offers'
        },
        {
          $match: {
            'offers.offerCalendarImplementation.frequencyPeriodStart': { $lt: today },
            $or: [
              { 'offers.offerCalendarImplementation.frequencyPeriodEnd': { $exists: false } },
              { 'offers.offerCalendarImplementation.frequencyPeriodEnd': { $gte: today } }
            ]
          }
        },
        {
          $addFields: {
            holdCount: { $size: { $ifNull: ['$hold', []] } } 
          }
        },
        {
          $match: {
            $expr: {
              $lt: ['$holdCount', '$totalQuantity'] 
            }
          }
        },
        {
          $project: {
            _id: '$offers._id', 
            roomID: '$_id', 
            roomType: 1, 
            offer: '$offers',
            thumbNail: 1,
            description: 1,
            basePrice: 1, 
            priceChangeTrends: 1, 
            baseAmenities: 1,
            totalQuantity: 1, 
            holdCount: 1 ,
            bedCount: 1,
            bedType: 1
          }
        }
      ];

    return await Room.aggregate(pipeline).then(async (res)=>{
        return await Promise.all(
            res.map(async (roomOffer)=>{
                const mappedOffer = await Room.getOffer(roomOffer);
                return mappedOffer;
            })
        )
    });
}