const signUp = () => {
    Swal.fire({
        title: 'Sign Up',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="First Name">'+
            '<input id="swal-input2" class="swal2-input" placeholder="Last Name">'+
            '<input id="swal-input3" class="swal2-input" placeholder="Email">'+
            '<input id="swal-input4" class="swal2-input" placeholder="Password">'+
            '<input id="swal-input5" class="swal2-input" placeholder="Confirm Password">',
        preConfirm: async () => {
            try {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value,
                    document.getElementById('swal-input5').value
                ]
            } catch (error) {
              Swal.showValidationMessage(`
                Request failed: ${error}
              `);
            }
          },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Feature is coming soon!");
        }
      });
}

const login = () => {
    Swal.fire({
        title: 'Login',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Email">'+
            '<input id="swal-input2" class="swal2-input" placeholder="Password">',
        preConfirm: async () => {
            try {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            } catch (error) {
              Swal.showValidationMessage(`
                Request failed: ${error}
              `);
            }
          },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Feature is coming soon!");
        }
    });
}