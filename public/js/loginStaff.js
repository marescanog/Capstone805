document.addEventListener("DOMContentLoaded", function(e) {
    const loginStaffButton = document.getElementById('EmployeeSubmit');
    const loginHotelButton = document.getElementById('HotelSubmit');

    if(loginStaffButton){
        loginStaffButton.addEventListener("click",()=>{
            const form = document.getElementById('EmployeeLoginForm');

            if(form){
                form.setAttribute('novalidate', '');
                const emailInput = form.querySelector('input[type="email"]');
                const passwordInput = form.querySelector('input[type="password"]');
                const data = {
                    email: emailInput.value,
                    password: passwordInput.value
                };

                if(data.email === "" || data.email == null || data.password === "" || data.password == null ){
                    Swal.fire({
                        title: "Unable to login!",
                        text: "Please enter your email and password",
                        icon: "error"
                    });
                } else {
                    try{
                        fetch('api/v1/employees/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(res => {
                            if(res.statusCode && res.statusCode.toString().startsWith("2")){
                                window.location.href = `dashboard/staff/${res.id}`;
                            } else if (res.statusCode && res.statusCode.toString().startsWith("4")) {
                                Swal.fire({
                                    title: "Unable to login!",
                                    text: res.message??"please try again",
                                    icon: "error"
                                });
                            } else {
                                Swal.fire({
                                    title: "Unable to login!",
                                    text: "please try again",
                                    icon: "error"
                                });
                            }
                        })
                        .catch(()=>{
                            Swal.fire({
                                title: "Something went wrong!",
                                text: "please try again",
                                icon: "error"
                            });
                        })
                    }catch(err){
                        Swal.fire({
                            title: "Something went wrong!",
                            text: "please try again",
                            icon: "error"
                        });
                    }
                }
                
            }

        });
    }

    if(loginHotelButton){
        loginHotelButton.addEventListener("click",()=>{
            const form = document.getElementById('HotelLoginForm');

            if(form){
                form.setAttribute('novalidate', '');
                const emailInput = form.querySelector('input[type="email"]');
                const passwordInput = form.querySelector('input[type="password"]');
                const data = {
                    email: emailInput.value,
                    password: passwordInput.value
                };
                if(data.email === "" || data.email == null || data.password === "" || data.password == null ){
                    Swal.fire({
                        title: "Unable to login!",
                        text: "Please enter your email and password",
                        icon: "error"
                    });
                } else {
                    try{
                        fetch('api/v1/employees/managementLogin', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(res => {
                            if(res.statusCode && res.statusCode.toString().startsWith("2")){
                                window.location.href = res.url;
                            } else if (res.statusCode && res.statusCode.toString().startsWith("4")) {
                                Swal.fire({
                                    title: "Unable to login!",
                                    text: res.message??"please try again",
                                    icon: "error"
                                });
                            } else {
                                Swal.fire({
                                    title: "Unable to login!",
                                    text: "please try again",
                                    icon: "error"
                                });
                            }
                        })
                        .catch(()=>{
                            Swal.fire({
                                title: "Something went wrong!",
                                text: "please try again",
                                icon: "error"
                            });
                        })
                    } catch (err) {
                        Swal.fire({
                            title: "Something went wrong!",
                            text: "please try again",
                            icon: "error"
                        });
                    }
                }
            }
        });
    }
});