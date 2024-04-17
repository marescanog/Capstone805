const {Room, photoSubSchema, amenitySubSchema, promotionsSubSchema, offerSubSchema} = require('./../models/roomModel');
const {compareDates, calculateDaysBetweenDates} = require('./../models/modelUtils/utilityFunctions');
const Guest = require('./../models/guestModel');
const Hold = require('./../models/holdModel');
const catchAsync = require('./../apiUtils/catchAsync');
const AppError = require('../apiUtils/appError');
const mongoose = require('mongoose');
const fs = require('node:fs');
const { resolveObjectKey } = require('chart.js/helpers');

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



// experimental function
async function getReservationCountsByRoomIDByDate(startDate, endDate) {
    return await Guest.aggregate([
        { $unwind: "$reservations" },
        {
            $replaceRoot: { newRoot: '$reservations' }
        },
        { $match: {
            $and: [
                { "checkinDate": { $lt: endDate } },
                { "checkoutDate": { $gt: startDate } },
                { "status": "pending" }
            ]
        }},
        { $project: {
            _id: "$_id",
            roomID: "$roomDetails.roomID",  
            numberOfRooms: "$numberOfRooms",
            dateRange: {
                $map: {
                    input: { $range: [
                        0,
                        { $subtract: [ "$checkoutDate", "$checkinDate" ] },
                        86400000
                    ]},
                    as: "day",
                    in: {
                        $let: {
                            vars: {
                                date: { $add: ["$checkinDate", "$$day"] }
                            },
                            in: "$$date"
                        }
                    }
                }
            }
        }},
        { $project: {
            _id: 1,
            roomID: 1,  
            numberOfRooms: 1,
            dateRange: {
                $filter: {
                    input: "$dateRange",
                    as: "date",
                    cond: { $and: [
                        { $gte: ["$$date", startDate] },
                        { $lt: ["$$date", endDate] }
                    ]}
                }
            }
        }},
        { $unwind: "$dateRange" },
        { $group: {
            _id: { roomID: "$roomID", date: "$dateRange" },  // Group by roomID and date
            totalRooms: { $sum: "$numberOfRooms" },
            reservationIDs: {
                $push: "$_id"
            }
        }},
        { $group: {
            _id: "$_id.roomID",  // Focus the final group by roomID only
            dates: { $push: { date: "$_id.date", total: "$totalRooms", reservations: "$reservationIDs" } }, // for manual test
        }},
        { $project: {
            _id: "$_id",  // Set _id to roomID
            dates: 1,
            reservations: 1 // for manual test
        }},
        { $sort: { "_id": 1, "dates.date": 1 } },
    ]);
}

async function getRoomQuantityPerRoomID(arrListOfRoomIDs) {
    // const holdEndOfDay = new Date(checkOut);
    // holdEndOfDay.setHours(23,59,59,999);
    // Use 2024-06-01T00:00:00.00 for testing
    // const test = new Date('2024-06-01T00:00:00.00');
    // console.log(`getRoomQuantityPerRoomID ${test.toLocaleDateString()}`);

    // No need to convert roomID to mongoose object since it is saved as an objectid in the database
    // const objectIds = arrListOfRoomIDs.map(id => new mongoose.Types.ObjectId(id));

    return await Room.aggregate([
        {
            $match: {
                _id: { $in: arrListOfRoomIDs } // Ensure to match only the rooms you want to process
            }
        },
        {
            $project: {
                "_id": 1,
                "roomType": 1,
                "miscInfo": 1,
                "todaysRoomAssignments": 1,
                "totalQuantity": 1
            }
        }
    ]);
}

async function getHoldsPerRoomType(checkin, checkout, sessionID) {
    return await Hold.aggregate([
        {
            $match: {
                holdStartDateTime: {
                    $gte: new Date(checkin),
                    $lte: new Date(checkout)
                },
                sessionID: { $ne: sessionID }
            }
        },
        {
            $group: {
                _id: {
                    room_id: "$room_id",
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$holdStartDateTime" } }
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.room_id",
                dates: {
                    $push: {
                        k: "$_id.date",
                        v: "$count"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,  
                room_id: "$_id",  
                dates: {
                    $arrayToObject: "$dates"
                }
            }
        }
    ]);
}


async function getAllRoomTypes() {
    return await Room.aggregate([
        {
            $project: {
                _id: 1, 
                roomType: 1,
                totalQuantity: 1
            }
        }
    ]);
}

async function getArrayOfAvailableRoomTypes(reservationsListByDateByType, roomQuantityPerRoomType, holdsPerRoomType, checkInDate, checkoutDate){
    const totalNotAvailablePerDayPerType = {};
    let TODOmessage = false;
    await Promise.all(
        reservationsListByDateByType.map( async (reservationsList) =>{
            // One to one map so no values are repeating
            const matchedRoomQuantity = roomQuantityPerRoomType.find(qty=>{ 
                return (qty._id).equals(reservationsList._id) // id is the roomID not reservations ID
            });

            if(matchedRoomQuantity){
                const {dates} = reservationsList;
                const {totalQuantity, hold, roomType} = matchedRoomQuantity;

                // TODO For early checkouts only include in the computation if one of the dates in the range of dates
                // is today e.x. dates.date == today, use a array filter or something
                if(dates && dates.filter(resDate =>
                    compareDates(resDate.date, new Date()) === 0
                ).length > 0){
                    // add an extra room available
                    if(!TODOmessage){
                        TODOmessage=true;
                        console.log('TODO room controller getArrayOfAvailableRoomTypes early checkout computation')
                    }
                }

                // // now that we have the data, we can check if the room is availble given a start and end date
                // // create a new array that keeps track of reservations + holds per date
                // using totalNotAvailablePerDayPerType

                if(dates){
                    // YYY-MM-DD
                    await Promise.all(
                        dates.map( rDateWithValue => {
                            let totals = {
                                reservationTotal:rDateWithValue.total,
                                holdTotal:0,
                                overallTotal:rDateWithValue.total,
                                totalQuantityRoom: totalQuantity
                            }
                            const dateStr = `${rDateWithValue.date.getFullYear()}-${(rDateWithValue.date.getMonth()+1).toString().padStart(2, '0')}-${rDateWithValue.date.getDate().toString().padStart(2, '0')}`
                      
                            if(!totalNotAvailablePerDayPerType.hasOwnProperty(roomType)){
                                totalNotAvailablePerDayPerType[roomType] = {}
                            }
                            if(!totalNotAvailablePerDayPerType[roomType].hasOwnProperty(dateStr)){
                                totalNotAvailablePerDayPerType[roomType][dateStr] = {}
                            }
                            totalNotAvailablePerDayPerType[roomType][dateStr]  = totals
                        })
                    )
                }

            }
        })
    )
    
    const allRoomTypes = await getAllRoomTypes();
    const roomTypeArray = await Promise.all(allRoomTypes.map(type => type.roomType));

    await holdsPerRoomType.map( async(hold) =>{
        const {room_id, dates} = hold;
        const roomTypeRes = allRoomTypes.find((resultRoom)=>{return (resultRoom._id).equals(room_id)});
        const {roomType, totalQuantity} = roomTypeRes;

        if(totalNotAvailablePerDayPerType?.roomType) {
            Object.keys(dates).map(key=>{
                let count  = dates[key];
                if(!totalNotAvailablePerDayPerType[roomType].hasOwnProperty(key)){
                    totalNotAvailablePerDayPerType[roomType][key] = {}
                }
                totalNotAvailablePerDayPerType[roomType][key]['holdTotal'] += count;
                totalNotAvailablePerDayPerType[roomType][key]['overallTotal'] += count;
            });
        }

        if(!totalNotAvailablePerDayPerType?.roomType){
            totalNotAvailablePerDayPerType[roomType] = {}

            Object.keys(dates).map(key=>{
                let count  = dates[key];
                if(!totalNotAvailablePerDayPerType[roomType].hasOwnProperty(key)){
                    totalNotAvailablePerDayPerType[roomType][key] = {}
                }
                totalNotAvailablePerDayPerType[roomType][key] = {
                    "reservationTotal": 0,
                    "holdTotal": count, // TO DO add room count to hold
                    "overallTotal": count,
                    "totalQuantityRoom": totalQuantity // this is the room limit of rooms that can be reserved per day
                }
            });
        }

        // const dateStr = `${rDateWithValue.date.getFullYear()}-${(rDateWithValue.date.getMonth()+1).toString().padStart(2, '0')}-${rDateWithValue.date.getDate().toString().padStart(2, '0')}`
        // if(!totalNotAvailablePerDayPerType.hasOwnProperty(roomType)){
        //     totalNotAvailablePerDayPerType[roomType] = {}
        // }
        // if(!totalNotAvailablePerDayPerType[roomType].hasOwnProperty(dateStr)){
        //     totalNotAvailablePerDayPerType[roomType][dateStr] = {}
        // }
        // totalNotAvailablePerDayPerType[roomType][dateStr]  = totals
    })

    // now that we got the mapped totals, we can finally compare and see which ones are available or not;
    // console.log(JSON.stringify(roomTypeArray, null, '\t'))
    // console.log(JSON.stringify(totalNotAvailablePerDayPerType, null, '\t'));
    // console.log(JSON.stringify(holdsPerRoomType, null, '\t'));

    await Promise.all( Object.keys(totalNotAvailablePerDayPerType).map(async (roomType)=>{
            // map each room
            await Promise.all( Object.keys(totalNotAvailablePerDayPerType[roomType]).map(date=>{
                // map each date
                if(totalNotAvailablePerDayPerType[roomType][date].overallTotal >= totalNotAvailablePerDayPerType[roomType][date].totalQuantityRoom){
                    // console.log(`total rooms ${totalNotAvailablePerDayPerType[roomType][date].totalQuantityRoom} total held and reserved ${totalNotAvailablePerDayPerType[roomType][date].overallTotal}`)
                    // remove from array list
                    const index = roomTypeArray.indexOf(roomType);
                    if (index > -1) { // only splice array when item is found
                        roomTypeArray.splice(index, 1); // 2nd parameter means remove one item only
                    }
                }
            }))
    }))

    return roomTypeArray;
}

function convertDateObjToDateStr(dateObj) {
    return `${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDate()}`
}



exports.getValidRoomOffers = async (req, res, next) => {

    // TODO ADD VALIDATION FOR TOTAL NIGHTS MAXIMUM OF 2 WEEKS

    const {checkin, checkout, guests, rooms} = req.query;

    let checkinArr = [];
    let checkoutArr = [];
    let checkinDate = new Date();
    let checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate()+1);
    // console.log('roomController 400')
    // console.log(`checkin ${checkin} checkout ${checkout}`)
    try{
        checkinArr = checkin ? checkin.split('-') : [];
        checkoutArr = checkout ? checkout.split('-') : [];
        checkinDate = checkinArr.length > 1 ? new Date(checkinArr[0], checkinArr[1]-1, checkinArr[2]) : checkinDate;
        checkoutDate = checkoutArr.length > 1 ? new Date(checkoutArr[0], checkoutArr[1]-1, checkoutArr[2]) : checkoutDate;
    } catch (err) {
        // console.log(`room controller ${err}`)
        checkinArr = [];
        checkoutArr = [];
    }
        // console.log('roomController 400')
        // console.log(`checkinArr[0] ${checkinArr[0]} checkinArr[1]-1 ${checkinArr[1]-1} checkinArr[2] ${checkinArr[2]}`)
        // console.log(`checkoutArr[0] ${checkoutArr[0]} checkoutArr[1]-1 ${checkoutArr[1]-1} checkoutArr[2] ${checkoutArr[2]}`)
        // console.log(`checkinDate ${checkinDate}`)
        // console.log(`checkout ${checkoutDate}`)
    checkinDate.setHours(0,0,0,0);
    checkoutDate.setHours(0,0,0,0);
    // checkoutDate.setHours(23,59,59,999);


    // before gettimg room offers we need an array of avaiable room types
    // In order to get array of available room types we need to know the heck in date and check out date
    // for each day we need to know numner of resevrtions booked(pending only, not cancelles), holds on that day and early releases
    // early releses can only happen on the current day
    // Im making these notes so I wont be confused as to what I am doing because I am so tired
    const reservationCountByRoomIDByDate = await getReservationCountsByRoomIDByDate(checkinDate, checkoutDate);

    const arrayOfIDs = await reservationCountByRoomIDByDate.map(roomID => roomID._id);

    const roomQuantityPerRoomType = await getRoomQuantityPerRoomID(arrayOfIDs);

    const holdsPerRoomType = await getHoldsPerRoomType(checkinDate, checkoutDate, req.sessionID);

    // console.log(holdsPerRoomType)
    // console.log('Room Quantity per room type')
    // console.log(JSON.stringify(roomQuantityPerRoomType,null,'\t'));

    // // maps arrays together to display total available rooms per day (calculates early checkout and holds on the day)
    const arrayOfAvailableRoomTypes = await getArrayOfAvailableRoomTypes(reservationCountByRoomIDByDate, roomQuantityPerRoomType, holdsPerRoomType, checkinDate, checkoutDate);
    // console.log(JSON.stringify(arrayOfAvailableRoomTypes,null,'\t'));

    // FOR TESTING & CHECK
    // fs.writeFile('../../test.txt', JSON.stringify(reservationCountByRoomIDByDate,null,'\t'), err => {
    //     if (err) {
    //     console.error(err);
    //     } else {
    //     // file written successfully
    //     console.error('file written successfully');
    //     }
    // });

    // console.log(`roomcontroller checkin ${checkinDate.toLocaleDateString()}`);
    // console.log(`roomcontroller checkout ${checkoutDate.toLocaleDateString()}`);


    if(checkin && checkout && checkinArr.length > 0 && checkoutArr.length > 0 && guests && rooms) {
        try {
            // first get room offers 
            // const roomTypesArray = ["Deluxe Room", "Budget Double Single", "Executive Queen Suite", "Budget Single Room", "Single Room", "Double Twin", "Executive King Suite", "Presidential Suite"];
            // const roomTypesArray = ["Single Room"];

            // const today = process?.env?.SERVER_DATE && process?.env?.SERVER_DATE != 'null' ? new Date(process?.env?.SERVER_DATE) : new Date();

            // This pipeline filters rooms according to offers by date (frequencyPeriodStart & frequencyPeriodEnd) only and specified room types
            const pipeline = [
                {
                    $unwind: '$offers'
                },
                {
                    $match: {
                    'offers.offerCalendarImplementation.frequencyPeriodStart': { $lt: checkinDate },
                    $or: [
                        { 'offers.offerCalendarImplementation.frequencyPeriodEnd': { $exists: false } },
                        { 'offers.offerCalendarImplementation.frequencyPeriodEnd': { $gte: checkoutDate } }
                    ],
                    'roomType': { $in: arrayOfAvailableRoomTypes }  // Filtering by roomType
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
                        holdCount: 1,
                        bedCount: 1,
                        bedType: 1
                    }
                }
              ];
        
            return await Room.aggregate(pipeline).then(async (res)=>{
                // This filters according to calendartype implementation, returning null if it is not valid
                return await Promise.all(
                    res.map(async (roomOffer)=>{
                        const mappedOffer = await Room.getOffer(roomOffer, checkinDate, checkoutDate);
                        return mappedOffer;
                    })
                )
            });

        } catch (err){
            return [];
        }
        
    }

    return [];
}


exports.getRoomByIDAndOffer = async (roomID, offerID) => {
    let room;
    try {

        room = await Room.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(roomID) } },
            { $unwind: '$offers' }, 
            { $match: { 'offers.offerReferenceID': new mongoose.Types.ObjectId(offerID) } } 
        ]);

    } catch(err){
        console.log(err)
        throw new AppError("Something went wrong in trying to retreive the room details!", 500)
    }
    return {
        success: true,
        data: room
    }
}




exports.getRoomByID = async (roomID) => {
    let room;
    try {
        room = await Room.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(roomID) } },
        ]);
    } catch(err){
        console.log(err)
        throw new AppError("Something went wrong in trying to retreive the room details!", 500)
    }
    return {
        success: true,
        data: room
    }
}