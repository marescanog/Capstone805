const formatMoneyValue = (value) => {
    return  `$${(parseFloat(value.toFixed(2))).toLocaleString('en-US',{ minimumFractionDigits: 2 })}`;
}

const computeTotalFees = (nightlyRate, totalNights, extraPersonFee) => {
    const  subTotalText = document.getElementById('subTotalText');
    const  totalTaxText = document.getElementById('totalTaxText');
    const  totalChargesText = document.getElementById('totalChargesText');
    const  paymentUponCheckinText = document.getElementById('paymentUponCheckinText');
    const  chargesDueNowText = document.getElementById('chargesDueNowText');
    const  disclaimerDueText = document.getElementById('disclaimerDueText');
    const  disclaimerChargeText = document.getElementById('disclaimerChargeText');
    
    let subTotal = (nightlyRate * totalNights) + extraPersonFee;
    let taxes = subTotal * 0.25
    let total = subTotal + taxes;
    let chargesDue = total *0.3;
    let paymentDue = total *0.7;

    if(subTotalText){
        subTotalText.innerText = formatMoneyValue(subTotal);
    }

    if(totalTaxText){
        totalTaxText.innerText = formatMoneyValue(taxes);
    }

    if(totalChargesText){
        totalChargesText.innerText = formatMoneyValue(total);
    }

    if(paymentUponCheckinText){
        paymentUponCheckinText.innerText  = formatMoneyValue(paymentDue);
    }

    if(chargesDueNowText){
        chargesDueNowText.innerText =  formatMoneyValue(chargesDue);
    }
    
    if(disclaimerChargeText){
        disclaimerChargeText.innerText =  formatMoneyValue(chargesDue);
    }

    if(disclaimerDueText){
        disclaimerDueText.innerText  = formatMoneyValue(paymentDue);
    }

}

document.addEventListener("DOMContentLoaded", function(e) {
    const loyaltyTrigger = document.getElementById('flexCheckDefault');
    const loyaltyContainer = document.getElementById('loyalty-container');
    const rewardsSelect = document.getElementById('rewards-dropdown-select');
    const  nightlyText = document.getElementById('nightlyText');
    const  totalNightsText = document.getElementById('totalNightsText');
    const subTotalTextHeader = document.getElementById('subTotalTextHeader');

    if(nightlyText && totalNightsText){
            const  extraPersonFeeText = document.getElementById('extraPersonFee');
            let nightlyRate = parseFloat(nightlyText.innerText);
            let totalNights = parseInt(totalNightsText.innerText);
            let extraPersonFee = extraPersonFeeText ? parseFloat(extraPersonFeeText.innerText) : 0;
            computeTotalFees(nightlyRate, totalNights, extraPersonFee);
    }

    if(loyaltyTrigger && subTotalTextHeader){
        loyaltyTrigger.addEventListener('change', (event) => {
            if(loyaltyContainer && rewardsSelect){
                if (event.currentTarget.checked) {
                    subTotalTextHeader.innerText = ""
                    loyaltyContainer.classList.add("visible");
                    rewardsSelect.disabled = false;
                    computeTotalFees(nightlyRate, totalNights, extraPersonFee);
                } else {
                    loyaltyContainer.classList.remove("visible");
                    rewardsSelect.disabled = true;
                    computeTotalFees(nightlyRate, totalNights, extraPersonFee);
                }
            }
        })
    }

    countdown('serverHeldSecondsInput', 'roomheldDisplaySeconds', 'reservationHeldLink', 'r-active', 'r-inactive');
});