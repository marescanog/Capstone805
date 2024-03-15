document.addEventListener("DOMContentLoaded", function(e) {
    const serverSecondsInput = document.getElementById('serverSeconds');
    let countdownElement = document.getElementById('countdown');
    let activationLink = document.getElementById('activationLink');
  
    let seconds = parseInt(serverSecondsInput.value)
    activationLink.classList.add('inactive'); 

    let timer = setInterval(function() {
        seconds -= 1;
        countdownElement.textContent = seconds; 

      if (seconds <= 0) {
        clearInterval(timer); 
        activationLink.classList.remove('inactive'); 
        activationLink.classList.add('active');
      }
    }, 1000);
});