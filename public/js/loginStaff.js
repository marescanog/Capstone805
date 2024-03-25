document.addEventListener("DOMContentLoaded", function(e) {
    const loginStaffButton = document.getElementById('EmployeeSubmit');
    const loginAdminButton = document.getElementById('AdminSubmit');

    if(loginStaffButton){
        loginStaffButton.addEventListener("click",()=>{
            const form = document.getElementById('EmployeeLoginForm');
            const emailInput = form.querySelector('input[type="email"]');
            const passwordInput = form.querySelector('input[type="password"]');

            if(form){
                form.setAttribute('novalidate', '');
                const data = {
                    email: emailInput.value,
                    password: passwordInput.value
                };
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
                    });
                }catch(err){
                    Swal.fire({
                        title: "Something went wrong!",
                        text: "please try again",
                        icon: "error"
                    });
                }
            }

        })
    }

});