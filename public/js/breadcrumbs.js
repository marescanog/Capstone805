// refactor to own css file
function updateProgress(stage) {
    // Reset all to default state
    document.querySelectorAll('.circle, .progress').forEach(el => {
      el.classList.remove('highlighted');
    });
    // Highlight based on current stage
    if (stage >= 1) {
      document.querySelector('#start .circle').classList.add('highlighted');
      document.querySelector('#start .circle img').src = "/img/icons/general/account.svg";
      document.querySelector('#middle .circle img').src = "/img/icons/general/payment.svg";
      document.querySelector('#end .circle img').src = "/img/icons/general/review.svg";
    }
    if (stage >= 2) {
      document.querySelector('#middle .circle').classList.add('highlighted');
      document.querySelectorAll('.progress')[0].classList.add('highlighted');
      document.querySelector('#start .circle img').src = "/img/icons/general/check.svg";
      document.querySelector('#middle .circle img').src = "/img/icons/general/payment.svg";
      document.querySelector('#end .circle img').src = "/img/icons/general/review.svg";
    }
    if (stage === 3) {
      document.querySelector('#end .circle').classList.add('highlighted');
      document.querySelectorAll('.progress')[1].classList.add('highlighted'); 
      document.querySelector('#middle .circle img').src = "/img/icons/general/check.svg";
    }
    if (stage === 4) {
      document.querySelector('#end .circle img').src = "/img/icons/general/check.svg";
    }
  }