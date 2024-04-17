const countdown = (serverSecondsInputDOMID, countdownElementDOMID, activationLinkDOMID, activeClassName, inactiveClassName) => {
  const serverSecondsInput = document.getElementById(serverSecondsInputDOMID);
  let countdownElement = document.getElementById(countdownElementDOMID);
  let activationLink = document.getElementById(activationLinkDOMID);

  let seconds = parseInt(serverSecondsInput.value)
  activationLink.classList.add(inactiveClassName); 

  let timer = setInterval(function() {
      seconds -= 1;

      if(seconds >= 0 ){
        countdownElement.textContent = seconds>60 ? `${(Math.floor(seconds/60)).toString().padStart(1,'0')}:${(seconds%60).toString().padStart(2,'0')}`: seconds; 
      }
      

    if (seconds <= 0) {
      clearInterval(timer); 
      activationLink.classList.remove(inactiveClassName); 
      activationLink.classList.add(activeClassName);
    }
  }, 1000);
}