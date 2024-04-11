document.addEventListener('DOMContentLoaded', function() {
    const flatpickrinstance = document.getElementById('flatpickrinstance');
    const inputA = document.getElementById('checkInDisplay');
    const inputB = document.getElementById('checkOutDisplay');
    const targetDiv = document.getElementById('targetDiv');
    const submit = document.getElementById('submit-search');
    const form = document.getElementById('search-form');
    const roomsInput = document.getElementById('rooms');
    const guestsInput = document.getElementById('guests');

    let fp;

    if(flatpickrinstance){
        const options = {
            inline: true,
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            defaultDate: ["2024-03-16", "2024-03-20"],
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            // console.log(selectedDates); // Contains the date range array
            // console.log(dateStr); // Contains the date range string
            const dateRange = dateStr.split(' to ');
            console.log(dateRange)
            inputA.value = dateRange[0];
            if(dateRange.length > 1){
                inputB.value = dateRange[1];
            }
        }
        }
        fp = flatpickr(flatpickrinstance, options);
    }

    const innerElement = fp.calendarContainer;
    
    let isInputAFocused = false;
    let isInputBFocused = false;
    
    const expandDiv = () => targetDiv.classList.add('expanded');
    const collapseDiv = () => targetDiv.classList.remove('expanded');
    
    // Updated toggle logic to not rely on isDivInteracted
    const toggleDivBasedOnFocus = () => {
        if (isInputAFocused || isInputBFocused) {
            expandDiv();
        } else {
            // Only collapse if neither input is focused, allowing for delayed checks
            collapseDiv();
        }
    };
    
    // Modifying blur events to use a check that accommodates Flatpickr's behavior
    const delayedCollapseCheck = () => {
        setTimeout(() => {
            // Check active element to see if the focus has moved to Flatpickr
            if (document.activeElement.closest('.flatpickr-calendar') !== innerElement && 
                document.activeElement !== inputA && 
                document.activeElement !== inputB) {
                    collapseDiv();
                }
        }, 10); // Short delay to account for focus transitions
    };
    
    inputA.addEventListener('focus', () => {
        isInputAFocused = true;
        expandDiv();
    });
    inputA.addEventListener('blur', () => {
        isInputAFocused = false;
        delayedCollapseCheck();
    });
    
    inputB.addEventListener('focus', () => {
        isInputBFocused = true;
        expandDiv();
    });
    inputB.addEventListener('blur', () => {
        isInputBFocused = false;
        delayedCollapseCheck();
    });
    
    // Listen for clicks within the document
    document.addEventListener('click', (event) => {
        const withinBoundaries = event.composedPath().includes(innerElement);
    
        // If a click occurs outside Flatpickr and inputs, consider collapsing
        if (!withinBoundaries) {
            delayedCollapseCheck();
        }
    });

    // Function to update input feedback
    function updateFeedback(input, message) {
        const feedbackElement = input.nextElementSibling; // Assumes the next element is the invalid-feedback
        if (message) {
            input.classList.add('is-invalid');
            feedbackElement.textContent = message; // Set the custom message
            feedbackElement.style.display = 'block'; // Show the feedback message
        } else {
            input.classList.remove('is-invalid');
            feedbackElement.style.display = 'none'; // Hide the feedback message
        }
    }

    // Validate date inputs with comparison
    function validateDateInputs() {
        let isValid = true;
        let messageCheckIn = '';
        let messageCheckOut = '';

        if (!inputA.value) {
            messageCheckIn = 'Check-in date is required';
            isValid = false;
        }

        if (!inputB.value) {
            messageCheckOut = 'Check-out date is required';
            isValid = false;
        }

        if (inputA.value && inputB.value && new Date(inputA.value) > new Date(inputB.value)) {
            messageCheckIn = 'Check-in date cannot be later than check-out date';
            messageCheckOut = 'Check-out date cannot be earlier than check-in date';
            isValid = false;
        }

        updateFeedback(inputA, messageCheckIn);
        updateFeedback(inputB, messageCheckOut);

        return isValid;
    }

    // Validate number inputs for guests and rooms
    function validateNumberInput(input) {
        const minValue = 1;
        const maxValue = 10;
        let message = '';

        if (input.value === '') {
            message = `Please enter number of ${input.name}`;
        } else if (input.value < minValue) {
            message = `Minimum number of ${input.name} is ${minValue}`;
        } else if (input.value > maxValue) {
            message = `Maximum number of ${input.name} is ${maxValue}`;
        }

        updateFeedback(input, message);

        return message === ''; // Returns true if there's no error message
    }

    if(submit){
        submit.addEventListener('click',(event)=>{
            if(form){
                event.preventDefault(); // Prevent default form submission behavior

                // Validate all inputs
                let isFormValid = validateDateInputs() & validateNumberInput(guestsInput) & validateNumberInput(roomsInput);

                const inputs = form.querySelectorAll('input:not([readonly])'); // Exclude readonly inputs from further generic validation
                inputs.forEach(input => {
                    if (!input.validity.valid) {
                        updateFeedback(input, input.validationMessage);
                        isFormValid = false;
                    }
                });

                if (isFormValid) {
                    console.log('Form is valid. Proceed with submission.');
                    // Fetch call or other submission logic goes here
                } else {
                    console.error('Form validation failed.');
                }
            }

            if(!form){
                console.error("No search form element")
            }
        })
    }



});