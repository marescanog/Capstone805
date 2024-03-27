// Function to control the dismissible behavior of the modal
function setModalDismissible(modalElement, isDismissible) {
  if (isDismissible) {
    modalElement.setAttribute('data-bs-backdrop', 'true');
    modalElement.setAttribute('data-bs-keyboard', 'true');
  } else {
    console.log("S")
    modalElement.setAttribute('data-bs-backdrop', 'static');
    modalElement.setAttribute('data-bs-keyboard', 'false');
  }
}

// Function to handle login
function handleLogin(loginModalEl) {
  setModalDismissible(loginModalEl, false);

  // // Start the API call
  // fetch('your-api-endpoint', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     // Your request payload
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // .then(response => response.json())
  // .then(data => {
  //   // Process the response data
  //   // ...
  // })
  // .catch(error => {
  //   // Handle any error
  //   console.error('Error:', error);
  // })
  // .finally(() => {
  //   setModalDismissible(true); // Re-enable the dismissal of the modal
  // });

  console.log("login user");
  // setModalDismissible(true);
}



document.addEventListener("DOMContentLoaded", function(e) {
  const loginModalEl = document.getElementById('loginModal');
  const loginModal = new bootstrap.Modal(loginModalEl);

  document.querySelector('.custom-login-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submit
    handleLogin(loginModalEl);
  });

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