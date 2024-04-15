document.addEventListener("DOMContentLoaded", function(e) {
    const radioSection = document.getElementById('main_guest_radios');
    const addressSection = document.getElementById('main_guest_address');
    const detailsSection = document.getElementById('main_guest_details');

    if(radioSection && addressSection && detailsSection){
        const mainGuestRadio = document.getElementById('isMainGuestcheckBox1');
        const otherGuestRadio = document.getElementById('isMainGuestcheckBox2');
        const inputs = document.querySelectorAll('#guestInfoContents input[type=text], #guestInfoContents input[type=tel], #guestInfoContents select');
    
        // Storing initial values
        const initialValues = {};
        inputs.forEach(input => {
            initialValues[input.id] = input.value;
        });
    
        // Function to set fields to readonly and repopulate with initial values
        function setFieldsReadonly() {
            inputs.forEach(input => {
                input.value = initialValues[input.id];
                input.readOnly = true;
                input.classList.remove('editable');
                input.classList.add('read-only');
                if(input.tagName === 'SELECT') {
                    input.disabled = true;
                }
            });
        }
    
        // Function to clear fields and make them editable
        function clearFields() {
            inputs.forEach(input => {
                inputs.forEach(input => {
                    if (input.type !== 'select-one') {
                        input.value = '';
                    } else {
                        // Reset the select box to the first option ("Select a country")
                        input.selectedIndex = 0;
                    }
                    input.readOnly = false;
                    input.classList.remove('read-only');
                    input.classList.add('editable');
                    if(input.tagName === 'SELECT') {
                        input.disabled = false;
                    }
                });
            });
        }
    
        // Event listener for radio buttons
        mainGuestRadio.addEventListener('change', function() {
            if (mainGuestRadio.checked) {
                setFieldsReadonly();
            }
        });
    
        otherGuestRadio.addEventListener('change', function() {
            if (otherGuestRadio.checked) {
                clearFields();
            }
        });
    
        // Initial setup based on the pre-checked radio button
        if (mainGuestRadio.checked) {
            setFieldsReadonly();
        } else {
            clearFields();
        }
    }
    

    const card_info_section = document.getElementById('card_info_section');
    const billing_address_section = document.getElementById('billing_address_section');
    
    if(card_info_section && billing_address_section){
        const sameAddressCheckbox = document.getElementById('sameAddress');
        const inputs = document.querySelectorAll('#billing_address_section input[type=text], #billing_address_section input[type=tel], #billing_address_section select');
    
        // Storing initial values
        const initialValues = {};
        inputs.forEach(input => {
            initialValues[input.id] = input.value;
        });
    
        // Function to set fields to readonly and repopulate with initial values
        function setFieldsReadonly() {
            inputs.forEach(input => {
                input.value = initialValues[input.id];
                input.readOnly = true;
                input.classList.remove('editable');
                input.classList.add('read-only');
                if(input.tagName === 'SELECT') {
                    input.disabled = true;
                }
            });
        }
    
        // Function to clear fields and make them editable
        function clearFields() {
            inputs.forEach(input => {
                inputs.forEach(input => {
                    if (input.type !== 'select-one') {
                        input.value = '';
                    } else {
                        // Reset the select box to the first option ("Select a country")
                        input.selectedIndex = 0;
                    }
                    input.readOnly = false;
                    input.classList.remove('read-only');
                    input.classList.add('editable');
                    if(input.tagName === 'SELECT') {
                        input.disabled = false;
                    }
                });
            });
        }
    
        sameAddressCheckbox.checked = true;
        
        if ( sameAddressCheckbox.checked) {
            setFieldsReadonly();
        } else {
            clearFields();
        }

        // Event listener for checkbox
        sameAddressCheckbox.addEventListener('change', function() {
            if (sameAddressCheckbox.checked) {
                setFieldsReadonly();
            } else {
                clearFields();
            }
        });
    }
    
});