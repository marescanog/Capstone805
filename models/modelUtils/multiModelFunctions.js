// const {Decimal128} = mongoose.Types;
// const {getRandomInt, adjustDays, compareDates} = require('./utilityFunctions.js');

const mongoose = require('mongoose');
const Guest = require('./../guestModel');
const {Room} = require('./../roomModel');
const {isValidDate} = require('./utilityFunctions');
const Hold = require('./../holdModel');
const AppError = require('./../../apiUtils/appError');
const randomString = require('random-string-alphanumeric-generator');

async function createReservation(guestId, sessionIformation, formdata) {
    let newReservation;
    if(sessionIformation == null) {
        throw new AppError('Checkout Session has expired!', 400);
    }

    const session = await mongoose.startSession();

    // TRANSACTIONS ARE NOT SUPPORTED IN LOCAL DB
    // ONLY IN ATLAS
    // IT WILL TAKE TIME TO CONFIGURE TRANSACTIONS SO
    // SINCE I DONT HAVE TIME SINCE THE PRESENTATION IS WEDNESDAY I OPTION TO JUST JECT IF WE ARE IN PRODUCTION VS IN DEVELOPMENT
    // AND ONLY USE TRANSACTIONS IN DEVELOPMENT
    // DECIDED NOT TO USE TRANSACTIONS
    try {
        session.startTransaction();
        const {sessionID, offer_id, room_id, created_at, expires_at, numberOfGuests, numberOfRooms} = sessionIformation;
        const {isMainGuest, firstName, lastName, mobileNumber, address, city, postalCode, 
            specialRequest, arrivalTime, cardHolderName, cardNumber, expiryDate, cardCVC, billingAddress, 
            billingCity, billingPostal, billingCountry, loyaltyCheck, loyaltyValue, sameBillingAddress
        } = formdata;
        // console.log(`sessionID ${sessionID}`);
        // console.log(`offer_id ${offer_id}`);
        // console.log(`room_id ${room_id}`);
        // console.log(`created_at ${created_at}`);
        // console.log(`expires_at ${expires_at}`);
        // console.log(`numberOfGuests ${numberOfGuests}`);
        // console.log(`numberOfRooms ${numberOfRooms}`)

        // validate date
        // Let us get the booking data based on the session checkout
        // Validate Checkin & Checkout Dates
        let checkin =  sessionIformation.checkin;
        let checkout = sessionIformation.checkout;

        //YYYY-MM-DD
        if(checkin === 'today' || checkin == null || !(isValidDate(checkin))){
            const today = new Date();
            checkin = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        }
        if(checkout === 'tomorrow' || checkout == null || !(isValidDate(checkout))){
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            checkout = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
        }

        // convert to dates
        const [ci_year, ci_month,  ci_day] = checkin.split('-').map(Number);
        const [co_year, co_month,  co_day] = checkout.split('-').map(Number);
        // console.log(checkin)
        // console.log(checkout)
        // console.log(`${ci_year} ${ci_month} ${ci_day}`)
        // console.log(`${co_year} ${co_month} ${co_day}`)
        const checkinDate = new Date(ci_year, ci_month-1,  ci_day);
        const checkoutDate = new Date(co_year, co_month-1,  co_day);
        // console.log(checkinDate)
        // console.log(checkoutDate)

        let guest;
        let room;

        let mainGuestOther = null;
        if(isMainGuest !== 'yes'){
            mainGuestOther = {
                firstName: firstName, 
                lastName: lastName,
                mobileNumber: mobileNumber,
                address: {
                    address: address,
                    city:city,
                    postalCode:postalCode
                }
            }
        }
        
        // if(process.env.NODE_ENV === 'production'){
        //     guest = await Guest.findById(guestId).session(session);
        // } else {
            guest = await Guest.findById(guestId)
        // }

        if (!guest) throw new AppError('Guest not found', 404);
;
        // Fetch room details to be included in the reservation{}
        room = await Room.findById(room_id)
        if (!room) throw new AppError('Room not found', 404);

        const bookingData = await Room.getCheckoutBookingData(offer_id, room_id, checkinDate, checkoutDate, numberOfGuests, numberOfRooms, guestId);

        const {baseAmenities, bedType, bedCount, miscInfo, offers} = room;
        const {maxExtraPersonAllowed, maxAllowedGuests} = miscInfo; 
   
        let mappedBasedAmenities = [];
        if(baseAmenities){
            mappedBasedAmenities = await Promise.all(
                baseAmenities.map(el=>{
                    return el.name;
                })
            )
        }

        let mappedAddedAmenities = [];
        // if(addedAmenities){
        //     mappedAddedAmenities = await Promise.all(
        //         offers.map(async(offer)=>{
        //             const {amenities} = offer;
        //             return await Promise.all(
        //                 amenities.map(el=>{
        //                     return el.name;
        //                 })
        //             )
        //         })
        //     )
        // }
        // console.log(offers)
        const cardNumString = typeof cardNumber === 'number' ? cardNumber.toString() :  cardNumber;

        const lastfour = cardNumString.slice(-4);

        let feesArr = [
            {
                "feeType": "base",
                "amount": bookingData.rate,
                "name": "Nightly Rate",
                "quantity": bookingData.totalNights,
            }
        ]

        const excesspersons = (numberOfRooms * maxAllowedGuests) - numberOfGuests;
        if(parseFloat(bookingData.rate.extraPersonFee) > 0 && excesspersons > 0){
            feesArr.push({
                "feeType": "penalty",
                "amount": bookingData.extraPersonFee,
                "name": "Extra Person Fees",
                "quantity": excesspersons,
            })
        }

        /*
            let taxes = subTotal * 0.25
            let total = subTotal + taxes;
            let chargesDue = total *0.3;
            let paymentDue = total *0.7;
        */
   
        const subTotal = bookingData.rate * bookingData.totalNights;
        const totalWithPenalties = subTotal + parseFloat(bookingData.extraPersonFee);
        const taxes = totalWithPenalties * 0.25;
        const total = totalWithPenalties + taxes;
        const chargesDue = total *0.3;
        const paymentDue = total *0.7;
        // console.log(`bookingData.extraPersonFee ${bookingData.rate}`)
        // console.log(`bookingData.extraPersonFee ${bookingData.extraPersonFee}`)
        // console.log(`totalWithPenalties ${totalWithPenalties}`)
        // console.log(`taxes ${taxes}`)
        // console.log(`total ${total}`)
        // console.log(`chargesDue ${chargesDue}`)
        // console.log(`paymentDue ${paymentDue}`)

        feesArr.push(  {
            "feeType": "tax",
            "amount": taxes,
            "name": "HST",
            "quantity": 1,
        });

        feesArr.push(  {
            "feeType": "payment",
            "amount": chargesDue,
            "name": "paid",
            "quantity": 1,
        });

        feesArr.push(  {
            "feeType": "payment",
            "amount": paymentDue,
            "name": "due",
            "quantity": 1,
        });

        const promos = await Promise.all(
            bookingData.promotions.map(el=>{
                let promo = {
                    "promoType": el?.promoType,
                    "name": el?.name,
                    "value": el?.priceChangeValue,
                    "quantity": 1,
                }
                if(el.priceChangeType){
                    promo["type"] = el.priceChangeType;
                }
                return promo;
            })
        )
        // console.log('promotions')
        // console.log(JSON.stringify(bookingData.promotions, null, '\t'))
        // add the offer promo
        // promos.push({
        //     "promoType": offers[0].offerType,
        //     "name": offers[0].description,
        //     "value": 1,
        //     "quantity": 1,
        // });

        newReservation = {
            reservationID: randomString.randomLetters(6, "uppercase"),
            roomDetails: {
                roomID: new mongoose.Types.ObjectId(room_id),
                roomOfferID: new mongoose.Types.ObjectId(offer_id),
                roomType: room.roomType,
                amenities: [...mappedBasedAmenities, ...mappedAddedAmenities],
                bedType: bedType,
                numberOfBeds: bedCount,
                pricePerNight: bookingData.rate
            },
            numberOfRooms: numberOfRooms,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            status: "pending",
            numberOfGuests: numberOfGuests,
            createdOn: new Date(),
            estimatedArrivalTime: arrivalTime,
            paymentDetails: {
                cardType: "Mastercard",
                lastFour: lastfour,
                cardHolderName :cardHolderName
            },
            priceBreakdown: {
                totalCharge: total,
                totalPaid: chargesDue,
                fees: feesArr,
                promotions: promos,
            },
        }

        if(mainGuestOther){
            newReservation['mainGuest'] = mainGuestOther;
        }

        if(specialRequest){
            newReservation['specialRequest'] = specialRequest;
        }

        if(!sameBillingAddress){
            newReservation.paymentDetails['billingAddress'] = {
                address: billingAddress,
                city: billingCity,
                postalCode: billingPostal,
                country: billingCountry
            }
        }
         // TODO billingAddress, billingCity, billingPostal, loyaltyCheck, loyaltyValue
        // after getting the resevation data, save the reservation

    } catch (err) {
        // Abort the transaction on error
        // if (session.inTransaction()) {
            await session.abortTransaction();
        // }
        console.error(err.stack);
        throw err;
    } finally {
        session.endSession();
    }

    return {message: "test", data: newReservation}
}

module.exports = {createReservation};