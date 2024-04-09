document.addEventListener("DOMContentLoaded", function(e) {
    countdown('serverSeconds', 'countdown', 'activationLink', 'active', 'inactive');

    const verifyButton = document.getElementById('verificationSubmitButton');
    const verifyAccForm = document.getElementById('verificationCodeForm');
    const resendActivation = document.getElementById('activationLink');
    const verificationCodeInput = document.getElementById('verificationCode');
    const emailInput = document.getElementById('email');

    if(verifyButton){
        verifyButton.addEventListener('click',()=>{
            if (!verificationCodeInput.checkValidity()) {
                verificationCodeInput.classList.add('is-invalid');
            } else {
                verificationCodeInput.classList.remove('is-invalid');
                console.log("verify button is clicked")
                try {
                    if(verifyAccForm){
                        verifyAccForm.setAttribute('novalidate', '');
                        const formData = new FormData(verifyAccForm);

                        // Convert FormData to a simple object
                        const formDataObj = Object.fromEntries(formData.entries());

                        fetch('/api/v1/sendActivationCode', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formDataObj),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('success')
                            console.log(data)
                        })
                        .catch(err=>{
                            console.log('error')
                            console.log(err)
                        })
                    } else {
                        console.error('form not found!')
                        launchSwalError();
                    }
                } catch (err) {
                    console.log(`Error with fetch: ${err}`)
                    launchSwalError();
                }
            }
        })
    }

    if(resendActivation){
        resendActivation.addEventListener('click',()=>{
            console.log("resend activation is clicked")
            try {
                if(verifyAccForm){
                    verifyAccForm.setAttribute('novalidate', '');
                    const formData = new FormData(verifyAccForm);

                    // Convert FormData to a simple object
                    const formDataObj = Object.fromEntries(formData.entries());

                    fetch('/api/v1/requestResendActivationCode', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formDataObj),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('success')
                        console.log(data)
                    })
                    .catch(err=>{
                        console.log('error')
                        console.log(err)
                    })
                } else {
                    console.error('form not found!')
                    launchSwalError();
                }
            } catch (err) {
                console.log(err)
                launchSwalError();
            }
        })
    }
});