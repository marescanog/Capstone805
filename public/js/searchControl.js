document.addEventListener("DOMContentLoaded", function(e) {
    const option_reservationNumber = document.getElementById("reservationNumber");
    const option_lastName = document.getElementById("lastName");
    const option_date = document.getElementById("date");
    const search = document.getElementById("search");
    
    if(option_reservationNumber){
        option_reservationNumber.onclick = function(){search.name = "reservationNumber"}
    }
    
    if(option_lastName){
        option_lastName.onclick = function(){search.name = "lastName"}
    }
    
    if(option_date){
        option_date.onclick = function(){search.name = "date"}
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const resParam = urlParams.get('reservationNumber');
    const lnameParam = urlParams.get('lastName');
    const dateParam = urlParams.get('date');
    if(resParam){
        search.value = resParam
        option_reservationNumber.checked = true;
        option_lastName.checked = false;
        option_date.checked = false;
    }

    if(lnameParam){
        search.value = lnameParam
        option_reservationNumber.checked = false;
        option_lastName.checked = true;
        option_date.checked = false;
    }

    if(dateParam){
        search.value = dateParam
        option_reservationNumber.checked = false;
        option_lastName.checked = false;
        option_date.checked = true;
    }
});