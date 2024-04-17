document.addEventListener("DOMContentLoaded", function() {
    const resetmanagerCodeButton = document.getElementById('resetmanagercode');

    if(resetmanagerCodeButton){
        resetmanagerCodeButton.addEventListener('click',()=>{
            Swal.fire({
                title: "Code Reset",
                text: "Please check your email for new code",
                icon: "success"
              });
        })
    }
})