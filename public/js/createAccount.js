function validateForm(form) {
    let isValid = true;
  
    if (!form) {
      console.error('Form not found');
      return false;
    }
  
    const requiredFields = [
      ...form.querySelectorAll('input:required, textarea:required')
    ];
  
    const selectFields = [
        ...form.querySelectorAll('select:required')
    ]

    requiredFields.forEach(input => {
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
  
      selectFields.forEach(select => {
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

function clearInput(inputElement) {
    inputElement.classList.remove('is-invalid', 'is-valid');
}

function clearValidationFeedback() {
    document.querySelectorAll('.is-valid, .is-invalid').forEach(element => {
        clearInput(element)
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const submitButton =  document.getElementById('submitBtn');
    if(submitButton){
        submitButton.addEventListener('click', function(event) {
            // Prevent the form from submitting traditionally
            event.preventDefault();

            const form = document.getElementById('createaccount');

            if(form){
                const formIsValid = validateForm(form);

                if(formIsValid){
                    const formData = new FormData(form);
            
                    // Convert FormData to a simple object
                    const formDataObj = Object.fromEntries(formData.entries());
            
                    fetch('/createaccount', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(formDataObj),
                    })
                    .then(response => {
                        if (!response.ok) {
                          throw response;
                        }
                        return response.json();
                    })
                    .then(data => {
                    Swal.fire({
                        title: "Registration Successful!",
                        text: "Please check you email to activate your account.",
                        icon: "success"
                    }).then(()=>{
                        // clear form and redirect
                        form.reset();
                        clearValidationFeedback();
                        Swal.fire({
                            title: "TODO",
                            text: "Add redirection to verify account page",
                            icon: "info"
                        })
                    })
                    })
                    .catch(errorResponse => {
                        // TODO double check catch err
                        try{
                            errorResponse.json().then(errorData => {
                                let data =  JSON.parse(errorData.jsonData)
                                launchSwalError(()=>{
                                    Object.keys(data).map((el)=>{
                                        const dataObject = data[el];
                                        const domEl = document.getElementById(el);
                                        if(domEl){
                                            clearInput(domEl);
                                            domEl.classList.add('is-invalid');
                                            domEl.reportValidity();
                                            const invalidFeedbackElement = domEl.nextElementSibling;
                                            invalidFeedbackElement.innerText = dataObject.message
                                        }
                                    })
                                }, "Submission unsuccessful!", errorData.message)
                                });
                        } catch {
                            launchSwalError(()=>{
                            }, "Submission unsuccessful!", "Please try again!")
                        }
                    });
                }
            }
            
        });
    }
    
});