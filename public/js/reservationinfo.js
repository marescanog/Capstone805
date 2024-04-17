document.addEventListener("DOMContentLoaded", function(e) {
    const datePicker = document.getElementById("datePicker");
    const inputcheckin = document.getElementById("inputcheckin");
    const inputcheckout = document.getElementById("inputcheckout");
    const checkinLabel = document.getElementById("checkinLabel");
    const checkoutLabel = document.getElementById("checkoutLabel");
    const calendarContainer = document.getElementById("calendar-container");
    const buttonEdit = document.getElementById("edit_date");
    const buttonSubmit = document.getElementById("submit_date");
    const buttonCancel = document.getElementById("cancel_date");
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
            buttonCancel.classList.remove('d-none');
            calendarContainer.classList.remove('d-none');
            inputcheckin.classList.remove('no-border');
            inputcheckout.classList.remove('no-border');
            checkinLabel.classList.remove('no-border');
            checkoutLabel.classList.remove('no-border');
        });
    }

    if(buttonCancel){
        buttonCancel.addEventListener('click',()=>{
            buttonEdit.classList.remove('d-none');
            buttonSubmit.classList.add('d-none');
            buttonCancel.classList.add('d-none');
            calendarContainer.classList.add('d-none');
            inputcheckin.classList.add('no-border');
            inputcheckout.classList.add('no-border');
            checkinLabel.classList.add('no-border');
            checkoutLabel.classList.add('no-border');
        });
    }

    if(buttonSubmit){
        buttonSubmit.addEventListener('click',()=>{
            buttonSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            buttonSubmit.disabled = true;
            buttonCancel.disabled = true;
            inputcheckin.setAttribute('readonly', true);
            inputcheckout.setAttribute('disabled', true);
            fpCalender.classList.add('hocho-unselectable');
            fp.set('disable', []); 

            setTimeout(function() {
                location.reload(); // Refresh page after successful save
            }, 2000); // Simulate network delay
        });
    }



    // ======================================================

    // EDIT & SAVE Additional Information

    const editAddInfoButton = document.getElementById('edit_addinfo');
    const saveAddInfoButton = document.getElementById('submit_addinfo');
    const cancelAddInfoButton = document.getElementById('cancel_addinfo');
    const specialRequestInput = document.getElementById('specialRequestInput');
    const arrivalTimeSelect = document.getElementById('selectArrivalTime');

    if(editAddInfoButton){
        editAddInfoButton.addEventListener('click', function() {
            editAddInfoButton.classList.add('d-none');
            saveAddInfoButton.classList.remove('d-none');
            cancelAddInfoButton.classList.remove('d-none');
            specialRequestInput.removeAttribute('readonly');
            specialRequestInput.classList.add('editable');
            arrivalTimeSelect.removeAttribute('disabled');
            arrivalTimeSelect.classList.add('editable');
            specialRequestInput.classList.remove('no-border');
            arrivalTimeSelect.classList.remove('no-border');
        });
    }

    if(cancelAddInfoButton){
        cancelAddInfoButton.addEventListener('click', function() {
            editAddInfoButton.classList.remove('d-none');
            saveAddInfoButton.classList.add('d-none');
            cancelAddInfoButton.classList.add('d-none');
            specialRequestInput.setAttribute('readonly', true);
            specialRequestInput.classList.remove('editable');
            arrivalTimeSelect.setAttribute('disabled', true);
            arrivalTimeSelect.classList.remove('editable');
            // Reset to initial values if needed
            specialRequestInput.value = specialRequestInput.defaultValue;
            arrivalTimeSelect.value = arrivalTimeSelect.querySelector('option[selected]').value;
            specialRequestInput.classList.add('no-border');
            arrivalTimeSelect.classList.add('no-border');
        });
    }

    if(saveAddInfoButton){
        saveAddInfoButton.addEventListener('click', function() {
            saveAddInfoButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            saveAddInfoButton.disabled = true;
            cancelAddInfoButton.disabled = true;
            specialRequestInput.setAttribute('readonly', true);
            arrivalTimeSelect.setAttribute('disabled', true);
    
            // Simulate fetch call
            setTimeout(function() {
                location.reload(); // Refresh page after successful save
            }, 2000); // Simulate network delay
        });
    }

    // ======================================================

    // EDIT & SAVE Guest Information

    const edit_guestInfo = document.getElementById('edit_guestInfo');
    const submit_guestInfo = document.getElementById('submit_guestInfo');
    const cancel_guestInfo = document.getElementById('cancel_guestInfo');

    const main_guest_radios = document.getElementById('main_guest_radios');
    const inputfirstName = document.getElementById('inputfirstName');
    const inputLastName = document.getElementById('inputLastName');
    const inputMobileNumber = document.getElementById('inputMobileNumber');
    const inputAddress = document.getElementById('inputAddress');
    const inputCity = document.getElementById('inputCity');
    const inputPostalCode = document.getElementById('inputPostalCode');
    const inputCountry = document.getElementById('inputCountry');
    const inputGuestInfoArr = [
        inputfirstName, inputLastName, inputMobileNumber, inputAddress, inputCity, inputPostalCode,
    ]

    if(edit_guestInfo){
        edit_guestInfo.addEventListener('click', function() {
            edit_guestInfo.classList.add('d-none');
            submit_guestInfo.classList.remove('d-none');
            cancel_guestInfo.classList.remove('d-none');
            // main_guest_radios.remove('d-none');

            inputGuestInfoArr.forEach(el=>{
                el.removeAttribute('readonly');
            })
            inputCountry.removeAttribute('disabled');

            inputGuestInfoArr.forEach(el=>{
                el.classList.add('editable');
            })
            inputCountry.classList.add('editable');

            inputGuestInfoArr.forEach(el=>{
                el.classList.remove('no-border');
            })
            inputCountry.classList.remove('no-border');
        });
    }

    if(cancel_guestInfo){
        cancel_guestInfo.addEventListener('click', function() {
            edit_guestInfo.classList.remove('d-none');
            submit_guestInfo.classList.add('d-none');
            cancel_guestInfo.classList.add('d-none');
            
            inputGuestInfoArr.forEach(el=>{
                el.setAttribute('readonly', true);
                el.classList.remove('editable');
            })
            inputCountry.setAttribute('disabled', true);
            inputCountry.classList.remove('editable');

            inputGuestInfoArr.forEach(el=>{
                el.classList.add('no-border');
            })
            inputCountry.classList.add('no-border');

            inputGuestInfoArr.forEach(el=>{
                el.value =  el.defaultValue
            })
            inputCountry.classList.remove('no-border');
            inputCountry.value = inputCountry.querySelector('option[selected]').value;
        });
    }

    if(submit_guestInfo){
        submit_guestInfo.addEventListener('click', function() {
            submit_guestInfo.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            submit_guestInfo.disabled = true;
            cancel_guestInfo.disabled = true;

            inputGuestInfoArr.forEach(el=>{
                el.setAttribute('readonly', true);
            })
            inputCountry.setAttribute('disabled', true);
    
            // Simulate fetch call
            setTimeout(function() {
                location.reload(); // Refresh page after successful save
            }, 2000); // Simulate network delay
        });
    }

    // =======================

    
    const cancelReservation = document.getElementById('cancelReservation');
    if(cancelReservation){
        cancelReservation.addEventListener('click', function() {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your reservation has been cancelled.",
                    icon: "success"
                  }).then((res) => {
                    location.reload(); // Refresh page after successful save
                  });
                }
              });
        })
    }
});