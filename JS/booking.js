
function collect_data(){
    let validCar = validateCar();
    let validStartDate = validateStartDate();
    let validEndDate = validateEndDate();
    return validCar && validStartDate && validEndDate;
}

function validateCar(){
    let carName = document.getElementById("carName").value;
    let Error = document.getElementById("CarError");

    if(carName == ""){
        Error.innerHTML = "Please Select A Car";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateStartDate(){
    let startDate = document.getElementById("startDate").value;
    let Error = document.getElementById("StartDateError");

    if(startDate == ""){
        Error.innerHTML = "Please Select Starting Date";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateEndDate(){
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let Error = document.getElementById("EndDateError");

    if(endDate == ""){
        Error.innerHTML = "Please Select Ending Date";
        return false;
    }
    else if(startDate != "" && endDate <= startDate){
        Error.innerHTML = "Ending Date Must Be After Starting Date";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}