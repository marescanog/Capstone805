function Redirect(id) {
    window.location.href = `/dashboard/manager/viewoffer/${id}`;
}

function Delete(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
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