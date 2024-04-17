
const launchSwalError = (_callback, title, text) => {
  Swal.fire({
    title: title??"Something went wrong!",
    text: text??"Please try again!",
    icon: "error"
  }).then(()=>{
    if(_callback){
      _callback();
    }
  })
}

// Function to handle login
function handleLogin(loginModalCloseButton, loginButton, buttonText, spinner) {
  loginModalCloseButton.disabled = true;
  setDisabledLoginButton (true, loginButton, buttonText, spinner);

  const form = document.getElementById('loginUserForm');

  if(form){
    try{
      const emailInput = form.querySelector('input[type="email"]');
      const passwordInput = form.querySelector('input[type="password"]');
      const data = {
        email: emailInput.value,
        password: passwordInput.value
      };
        try{
          fetch('api/v1/guests/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
          })
          .then(response => {
            try {
              const json = response.json();
              return json;
            } catch (err){
              console.log(response);
              return {
                statusCode: 500,
                resbody: response,
                message: "Something went wrong!"
              }
            }
          })
          .then(res => {
            // console.log(res)
              if(res.statusCode && res.statusCode.toString().startsWith("2")){
                  setDisabledLoginButton (false, loginButton, buttonText, spinner);
                  loginModalCloseButton.disabled = false;
                  window.location.href = `dashboard/guest/${res.id}`;
              } else if (res.statusCode && res.statusCode.toString().startsWith("4")) {
                  launchSwalError(()=>{
                    setDisabledLoginButton (false, loginButton, buttonText, spinner);
                    loginModalCloseButton.disabled = false;
                  }, "Unable to login", res.message);
              } else {
                // console.log(res)
                  launchSwalError(()=>{
                    setDisabledLoginButton (false, loginButton, buttonText, spinner);
                    loginModalCloseButton.disabled = false;
                  }, "Unable to login")
              }
          })
          .catch(err=>{
            // console.log(err);
            launchSwalError(()=>{
              setDisabledLoginButton (false, loginButton, buttonText, spinner);
              loginModalCloseButton.disabled = false;
            })
          })
        }catch(err){
          // console.log(err)
          launchSwalError(()=>{
            setDisabledLoginButton (false, loginButton, buttonText, spinner);
            loginModalCloseButton.disabled = false;
          })
        }
    } catch (err){
      // console.log(err)
      launchSwalError(()=>{
        setDisabledLoginButton (false, loginButton, buttonText, spinner);
        loginModalCloseButton.disabled = false;
      })
    }


  } else {
    // console.log(err)
    launchSwalError(()=>{
      setDisabledLoginButton (false, loginButton, buttonText, spinner);
      loginModalCloseButton.disabled = false;
    })
  }
}

function setDisabledLoginButton (state, loginButton, buttonText, spinner) {
  if(state){
    // Hide the button text and show the spinner
    buttonText.style.display = 'none';
    spinner.style.display = 'block';
    loginButton.disabled = true;
  } else {
    // Show button and hide spinner
    buttonText.style.display = '';
    spinner.style.display = 'none';
    loginButton.disabled = false;
  }
}

function logout () {
  try{
    fetch('/api/v1/logout')
    .then(response => response.json())
    .then(res => {
      if(res.statusCode && res.statusCode.toString().startsWith("2")){
        window.location.href = '/';
      } else {
          launchSwalError();
      }
    });
  } catch(err){
    launchSwalError();
  }
}

document.addEventListener("DOMContentLoaded", function(e) {
  const alertToLogin = document.getElementById('alertToLogin');
  const loginModalCloseButton = document.getElementById('loginModalCloseButton');
  const buttonText = document.getElementById('buttonText');
  const spinner = document.getElementById('spinner');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logout');

  loginButton.addEventListener('click', function(event) {
    event.preventDefault(); 
    handleLogin(loginModalCloseButton, loginButton, buttonText, spinner);
  });

  if(logoutButton){
    logoutButton.addEventListener('click', function(event) {
      event.preventDefault();
      logout();
    });
  }

  if(alertToLogin){
    Swal.fire({
      title: "Session Expired!",
      text: "Please login again.",
      icon: "info"
    }).then(
      window.location.href = '/home'
    )
  }
});


















// const signUp = () => {
//     Swal.fire({
//         title: 'Sign Up',
//         html:
//             '<input id="swal-input1" class="swal2-input" placeholder="First Name">'+
//             '<input id="swal-input2" class="swal2-input" placeholder="Last Name">'+
//             '<input id="swal-input3" class="swal2-input" placeholder="Email">'+
//             '<input id="swal-input4" class="swal2-input" placeholder="Password">'+
//             '<input id="swal-input5" class="swal2-input" placeholder="Confirm Password">',
//         preConfirm: async () => {
//             try {
//                 return [
//                     document.getElementById('swal-input1').value,
//                     document.getElementById('swal-input2').value,
//                     document.getElementById('swal-input3').value,
//                     document.getElementById('swal-input4').value,
//                     document.getElementById('swal-input5').value
//                 ]
//             } catch (error) {
//               Swal.showValidationMessage(`
//                 Request failed: ${error}
//               `);
//             }
//           },
//         allowOutsideClick: () => !Swal.isLoading()
//       }).then((result) => {
//         if (result.isConfirmed) {
//             Swal.fire("Feature is coming soon!");
//         }
//       });
// }

// const login = () => {
//     Swal.fire({
//         title: 'Login',
//         html:
//             '<input id="swal-input1" class="swal2-input" placeholder="Email">'+
//             '<input id="swal-input2" class="swal2-input" placeholder="Password">',
//         preConfirm: async () => {
//             try {
//                 return [
//                     document.getElementById('swal-input1').value,
//                     document.getElementById('swal-input2').value
//                 ]
//             } catch (error) {
//               Swal.showValidationMessage(`
//                 Request failed: ${error}
//               `);
//             }
//           },
//         allowOutsideClick: () => !Swal.isLoading()
//     }).then((result) => {
//         if (result.isConfirmed) {
//             Swal.fire("Feature is coming soon!");
//         }
//     });
// }