document.addEventListener("DOMContentLoaded", function(e) {
    const datePicker = document.getElementById("datePicker");
    const inputcheckin = document.getElementById("inputcheckin");
    const inputcheckout = document.getElementById("inputcheckout");
    const checkinLabel = document.getElementById("checkinLabel");
    const checkoutLabel = document.getElementById("checkoutLabel");
    const calendarContainer = document.getElementById("calendar-container");
    const buttonEdit = document.getElementById("edit_date");
    const buttonSubmit = document.getElementById("submit_date");
    datePicker.style.display = 'none';

    const fp = flatpickr(datePicker, {
        mode: "range",
        dateFormat: "Y-m-d",
        inline: true,
        defaultDate: ["2024-03-16", "2024-03-20"],
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            // If both dates are selected, you might want to split the string and set them individually
            // This example assumes you're using a single input for the range
            // For separate inputs, see additional comments below
            console.log(selectedDates); // Contains the date range string
            console.log(dateStr); // Contains the date range string
            const dateRange = dateStr.split(' to ');
            console.log(dateRange)
            inputcheckin.value = dateRange[0];
            if(dateRange.length > 1){
                inputcheckout.value = dateRange[1];
            }
        }
    });
    const fpCalender = fp.calendarContainer;

    if(buttonEdit){
        buttonEdit.addEventListener('click',()=>{
            buttonEdit.classList.add('d-none');
            buttonSubmit.classList.remove('d-none');
            calendarContainer.classList.remove('d-none');
            inputcheckin.classList.remove('no-border');
            inputcheckout.classList.remove('no-border');
            checkinLabel.classList.remove('no-border');
            checkoutLabel.classList.remove('no-border');
        });
    }

    if(buttonSubmit){
        buttonSubmit.addEventListener('click',()=>{
            buttonSubmit.classList.add('d-none');
            buttonEdit.classList.remove('d-none');
            calendarContainer.classList.add('d-none');
            inputcheckin.classList.add('no-border');
            inputcheckout.classList.add('no-border');
            checkinLabel.classList.add('no-border');
            checkoutLabel.classList.add('no-border');

            // input fetch api
        });
    }
});