const mongoose = require('mongoose');

// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
}

let  adjustDays = (date, numberOfDays) => {
    let days =  date.getDate();
    let newDays = date.getDate() + numberOfDays;
    let time = date.getTime();
    // let newDateInMs = (new Date(time)).setDate(newDays);
    let newDateInMs = (new Date(time)).setDate(newDays);
    // console.log(`Is it an instance of date ${newDateInMs instanceof Date}`);
    // console.log(`Date ${newDateInMs instanceof Date ? newDateInMs : new Date(newDateInMs)}`);
    return newDateInMs instanceof Date ? newDateInMs : new Date(newDateInMs);
}

// returns -1 if the dateA is less than dateB
// returns 1 if the dateA is greater than dateB
// returns 0 if the dateA is same as dateB
const compareDates = (dateA, dateB) => {
    let retVal;
    if (dateA instanceof Date && dateB instanceof Date){
        // compare year
        if(dateA.getFullYear() == dateB.getFullYear()){
            // compare month
            if(dateA.getMonth() == dateB.getMonth()){
                // compare day
                if(dateA.getDate() == dateB.getDate()){
                    retVal = 0;
                } else {
                    retVal = dateA.getDate() > dateB.getDate() ? 1 : -1;
                }
            } else {
                retVal = dateA.getMonth() > dateB.getMonth() ? 1 : -1;
            }
        } else {
            retVal = dateA.getFullYear() > dateB.getFullYear() ? 1 : -1;
        }
    }
    return retVal;
}

// randomDate(new Date(2012, 0, 1), new Date())
function randomDate(startDate, endDate) {
    if(!(startDate instanceof Date)) throw new Error("randomDate function: startDate is not an instance of Date");
    if(!(endDate instanceof Date)) throw new Error("randomDate function: endDate is not an instance of Date");
    let startTime = startDate.getTime();
    return new Date(startTime + Math.random() * (endDate.getTime() - startTime));
}

function calculateDaysBetweenDates(checkInDate, checkOutDate) {
    // Create date objects for check-in and checkout dates
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return Math.ceil(diffInDays); // Use Math.ceil to round up to the nearest whole number
}

function isValidDate(dateString) {
    // Regular expression to check the format 'YYYY-MM-DD'
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // Check if the format matches
    if (!dateString.match(regex)) {
        return false; // If format does not match, return false
    }

    // Destructure the string to separate year, month, and day
    const [year, month, day] = dateString.split('-');

    // Create a date instance using the parts
    const date = new Date(year, month - 1, day); // Month is 0-indexed

    // Check the validity of the date by comparing the parts with the created date instance
    const valid = (date.getFullYear() === parseInt(year, 10)) &&
                  (date.getMonth() === parseInt(month, 10) - 1) &&
                  (date.getDate() === parseInt(day, 10));

    return valid; // Return the validity
}

function isValidMongoId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function getSecondsBetweenDates(date1, date2, isAbsolute = true) {
    // Calculate the difference in milliseconds
    const difference = date2.getTime() - date1.getTime();
    
    // Convert milliseconds to seconds and return the absolute value
    return isAbsolute ? Math.abs(difference / 1000) : (difference / 1000);
}

function formatDate_Mon_DD_YYYY(date) {
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Extract the month, date, and year from the date object
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Format the date string
    return `${month} ${day}, ${year}`;
}
module.exports = {getRandomInt, adjustDays, compareDates, randomDate, calculateDaysBetweenDates, isValidDate, isValidMongoId, getSecondsBetweenDates, formatDate_Mon_DD_YYYY}