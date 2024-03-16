const headerTitles = ["Guest Information","Payment Information","Review Information"];

function nextSection(targetSection) {
    if (!validateCurrentSection(targetSection-1)) {
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
  
function populateReviewSection() {
    // Fetch values from input fields
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const email = document.querySelector('input[name="emailAddress"]').value;
    const cardNumber = document.querySelector('input[name="cardNumber"]').value;
    // Populate review placeholders
    document.getElementById('reviewFirstName').textContent = firstName;
    document.getElementById('reviewLastName').textContent = lastName;
    document.getElementById('reviewEmail').textContent = email;
    // For privacy, consider showing only the last 4 digits of the card number
    document.getElementById('reviewCardNumber').textContent = `**** **** **** ${cardNumber.slice(-4)}`;
}

function validateCurrentSection(sectionNumber) {
    const section = document.getElementById(`section${sectionNumber}`);
    let isValid = true;
    let inputs = [];
    
    if(section){
        inputs = [...(section.querySelectorAll('input:required'))]
    }
  
    inputs.forEach(input => {
      // Check validity
      if (!input.checkValidity()) {
        isValid = false;
        // Trigger the browser's default invalid feedback
        input.reportValidity();
      }
    });
  
    return isValid;
}

function finalStepBeforeSubmit() {
    // Re-enable all input fields for submission
    const allInputs = document.querySelectorAll('.form-section input');
    allInputs.forEach(input => input.disabled = false);
    
    document.getElementById('reservationForm').setAttribute('novalidate', '');
}

document.addEventListener("DOMContentLoaded", function(e) {
    
    const btn_1Section = document.getElementById('button_s1');
    const btn_2Section = document.getElementById('button_s2');
    const button_s2_back = document.getElementById('button_s2_back')
    const btn_3Section_back = document.getElementById('btn_3Section_back') 
    // const headerTitleText = document.getElementById('h1_styled_partial');
    const submit_button = document.getElementById('submitButton') ;
    updateProgress(1);
    let page = 1;
    nextSection(page);

    if(btn_1Section){
        btn_1Section.addEventListener("click",()=>{
            page++;
            if(!nextSection(page)){
                page--;
            } else {
                // headerTitleText.innerText = headerTitles[page-1];
                // updateProgress(page);
            }
        })
    }

    if(btn_2Section){
        btn_2Section.addEventListener("click",()=>{
            page++;
            if(!nextSection(page)){
                page--;
            } else {
                // headerTitleText.innerText = headerTitles[page-1];
                // updateProgress(page);
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