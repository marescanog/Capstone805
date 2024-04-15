const headerTitles = ["Guest Information","Payment Information","Review Information"];

function nextSection(targetSection, novalidate=false) {
    if (!novalidate && !validateCurrentSection(targetSection-1)) {
        // If the current section is not valid, stop the function from proceeding
        return false;
    }
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section, index) => {
        if (index === targetSection - 1) {
            section.classList.remove('hidden');
            let inputs = section.querySelectorAll('input');
            inputs.forEach(input => input.disabled = false);

            // Populate the review section when moving to it
            if (targetSection === 3) {
                populateReviewSection();
            }

        } else {
            section.classList.add('hidden');
            let inputs = section.querySelectorAll('input');
            inputs.forEach(input => input.disabled = true);
        }
    });
    updateProgress(targetSection);
    const headerTitleText = document.getElementById('h1_styled_partial');
    if(headerTitleText){
        headerTitleText.innerText = headerTitles[targetSection-1];
    }
    window.scrollTo(0,0);
    return true;
}

// const firstName = document.querySelector('input[name="firstName"]').value;
// document.getElementById('reviewFirstName').textContent = firstName;
function populateReviewSection() {
    const allInputs = document.querySelectorAll('.form-section input');
    allInputs.forEach(input => {
        const textDomEl = document.getElementById(`review${input.name}`);
        if(textDomEl){
            if(input.name != "cardNumber" ){
                if(input.value == "" || input.value == null){
                    textDomEl.parentElement.style.display = 'none';
                } else {
                    textDomEl.parentElement.style.display = 'block';
                    textDomEl.textContent = input.value;
                }
    
            } else {
                textDomEl.textContent = `**** **** **** ${(input.value).slice(-4)}`;
            }
        }
    });
    const allSelect = document.querySelectorAll('.form-section select');
    allSelect.forEach(select => {
        const textDomEl = document.getElementById(`review${select.name}`);
        if(textDomEl){
            if(select.value == "" || select.value == null){
                textDomEl.parentElement.style.display = 'none';
            } else {
                textDomEl.parentElement.style.display = 'block';
                textDomEl.textContent = select.value;
            }
        }
        // console.log(select)
        // console.log(select.value)
        // console.log(select.name)
    });
    const allTextarea = document.querySelectorAll('.form-section textarea');
    allTextarea.forEach(textArea => {
        // console.log(textArea)
        // console.log(textArea.value)
        // console.log(textArea.name)
        const textDomEl = document.getElementById(`review${textArea.name}`);
        if(textDomEl){
            if(textArea.value == "" || textArea.value == null){
                // textDomEl.parentElement.style.display = 'none';
                textDomEl.textContent = 'none';
            } else {
                // textDomEl.parentElement.style.display = 'block';
                textDomEl.textContent = textArea.value;
            }
        }

    });
}

const clearInput = (input) => {
    if(input.classList.contains('is-valid')){
        input.classList.remove('is-valid');
    }
    if(input.classList.contains('is-invalid')){
        input.classList.remove('is-invalid');
    }
}

function validateCurrentSection(sectionNumber) {
    const section = document.getElementById(`section${sectionNumber}`);
    let isValid = true;
    let inputs = [];
    let selects = [];

    if(section){
        inputs = [...(section.querySelectorAll('input:required'))];
        selects = [...(section.querySelectorAll('select:required'))];
    }
  
    inputs.forEach(input => {
      // Check validity
      if (!input.checkValidity()) {
        isValid = false;
        clearInput(input);
        input.classList.add('is-invalid');
        // Trigger the browser's default invalid feedback
        input.reportValidity();
      } else {
        clearInput(input);
        input.classList.add('is-valid');
      }
    });
  
    selects.forEach(select => {
        // Check validity
        const defaultValue = select.options[0].innerText;
        if(defaultValue === select.value){
            isValid = false;
            clearInput(select);
            select.classList.add('is-invalid');
            // select.reportValidity(); // Does nothing since select will always have a value
        } else {
            clearInput(select);
            select.classList.add('is-valid');
        }
    });

    return isValid;
}

function finalStepBeforeSubmit() {
    // Re-enable all input fields for submission
    const allInputs = document.querySelectorAll('.form-section input');
    allInputs.forEach(input => input.disabled = false);
    
    const form = document.getElementById('reservationForm');

    if(form){
        form.setAttribute('novalidate', '');
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        fetch('/createReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // alert(data.message); // Show success message
                // form.reset(); // Reset form to clear fields
                // Then redirect with swal 9replace alert messages)
                Swal.fire({
                    title: 'Reservation Created!',
                    text: data.message??'Your Date is booked!.',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                  }).then((result) => {
                    if (result.value || result.dismiss) {
                      form.reset(); 
                      window.location.href = '/dashboard/guest/reservations';
                    }
                  });
            } else {
                Swal.fire({
                    title: "Something went wrong!",
                    text: data.message??"please try again",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        Swal.fire({
            title: "Something went wrong!",
            text: "please try again",
            icon: "error"
        });
    }
    
}



// Our Executed code
document.addEventListener("DOMContentLoaded", function(e) {
    
    const btn_1Section = document.getElementById('button_s1');
    const btn_2Section = document.getElementById('button_s2');
    const button_s2_back = document.getElementById('button_s2_back')
    const btn_3Section_back = document.getElementById('btn_3Section_back') 
    // const headerTitleText = document.getElementById('h1_styled_partial');
    const submit_button = document.getElementById('submitButton') ;
    updateProgress(1); // change back to 1
    let page = 1;
    nextSection(page);
    // nextSection(2, true)
    if(btn_1Section){
        btn_1Section.addEventListener("click",()=>{
            page++;
            if(!nextSection(page)){
                page--;
            } 
        })
    }

    if(btn_2Section){
        btn_2Section.addEventListener("click",()=>{
            page++;
            if(!nextSection(page)){
                page--;
            } 
        })
    }

    if(btn_3Section_back){
        btn_3Section_back.addEventListener("click",()=>{
            page--;
            nextSection(page);
        })
    }

    if(button_s2_back){
        button_s2_back.addEventListener("click",()=>{
            page--;
            nextSection(page);
        })
    }

    if(submit_button){
        submit_button.addEventListener('click', finalStepBeforeSubmit);
    }     

});