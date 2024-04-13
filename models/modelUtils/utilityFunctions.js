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

module.exports = {getRandomInt, adjustDays, compareDates, randomDate, calculateDaysBetweenDates}