function Redirect(id){
    window.location.href = `/dashboard/USNVMQD493/managepermissions/${id}`;
}

function PassReset(id){
    Swal.fire({
        title: "Password Reset",
        text: "A link has been emailed to this user!",
        icon: "success"
    });
}

function CodeReset(id){
    Swal.fire({
        title: "Code Reset",
        text: "A link has been emailed to this user!",
        icon: "success"
    });
}


function ActivationLink(id){
    Swal.fire({
        title: "Activation Link Sent",
        text: "A link has been emailed to this user!",
        icon: "success"
    });
}

function Deactivate(id){
    Swal.fire({
        title: "Are you sure?",
        text: "The user will immidiately not have access",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, deactivate!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Coming Soon!",
            text: "Delete Function Coming soon",
            icon: "info"
          });
        }
      });
}