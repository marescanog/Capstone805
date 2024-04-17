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
                            // console.log(`data: ${JSON.stringify(data, null, '\t')}`)
                            if(data?.statusCode === 200){
                                Swal.fire({
                                    title: "Registration Successful",
                                    text: "Acccount is now verified. You may now login.",
                                    icon: "success"
                                })
                                .then(()=>{
                                    window.location.href = '/home';
                                })
                            } else if (data?.statusCode === 201){
                                Swal.fire({
                                    title: "Registration Successful!",
                                    text: "Acccount is now verified. You may now complete your reservation.",
                                    icon: "success"
                                })
                                .then(()=>{
                                    window.location.href = '/checkout';
                                })
                            } else {
                                launchSwalError();
                            }
                        })
                        .catch(err=>{
                            console.log('error');
                            console.log(err);
                            launchSwalError();
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