document.addEventListener("DOMContentLoaded", function(e) {
    const search = document.getElementById("search");

    const searchOptions = document.querySelectorAll('.view-reservation-filter-options-container .form-check-input');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let setDefault = true;

    searchOptions.forEach((input, index, arr) => {
        input.onclick = function(){search.name = input.id};

        const param = urlParams.get(input.id);

        if(param != null){
            setDefault = false;
            search.value = param
            searchOptions.forEach(resetInput => {
                if(resetInput.id === input.id){
                    input.checked = true;
                    search.name = input.id
                } else {
                    resetInput.checked = false;
                }
            });
        }

        if(index == (arr.length - 1) && setDefault){
            searchOptions[0].checked = true;
            search.name = searchOptions[0].id
        }
    });

});