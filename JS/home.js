document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("searchForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            if (!collect_data()) {
                event.preventDefault();
            }
        });
        form.addEventListener("reset", function () {
            let errors = document.querySelectorAll(".error, .message");
            for (let i = 0; i < errors.length; i++) {
                errors[i].innerHTML = "";
            }
        });
    }
});

function collect_data()
{
    let validPickupLocation = validatePickupLocation();
    let validDropLocation = validateDropLocation();
    let validPickupDate = validatePickupDate();
    let validPickupTime = validatePickupTime();
    let validReturnDate = validateReturnDate();
    let validReturnTime = validateReturnTime();
    let validOrder = validateReturnOrder();

    let msg = document.getElementById("carMsg");
    if (validPickupLocation && validDropLocation && validPickupDate && validPickupTime &&
        validReturnDate && validReturnTime && validOrder)
    {
        msg.innerHTML = "Search form is correct";
        msg.style.color = "green";
        return true;
    }
    else
    {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validatePickupLocation()
{
    let location = document.getElementById("pickupLocation").value;
    let Error = document.getElementById("PickupLocationError");
    if (location == "")
    {
        Error.innerHTML = "Please Select The Pickup Location";
        return false;
    }
    else
    {
        Error.innerHTML = "Pickup Location: " + location;
        return true;
    }
}

function validateDropLocation()
{
    let location = document.getElementById("dropLocation").value;
    let Error = document.getElementById("DropLocationError");
    if (location == "")
    {
        Error.innerHTML = "Please Select The Drop Location";
        return false;
    }
    else
    {
        Error.innerHTML = "Drop Location: " + location;
        return true;
    }
}

function validatePickupDate()
{
    let date = document.getElementById("pickupDate").value;
    let Error = document.getElementById("PickupDateError");
    if (date == "")
    {
        Error.innerHTML = "Please Select The Pickup Date";
        return false;
    }
    else
    {
        Error.innerHTML = "Pickup Date: " + date;
        return true;
    }
}

function validatePickupTime()
{
    let time = document.getElementById("pickupTime").value;
    let Error = document.getElementById("PickupTimeError");
    if (time == "")
    {
        Error.innerHTML = "Please Select The Pickup Time";
        return false;
    }
    else
    {
        Error.innerHTML = "Pickup Time: " + time;
        return true;
    }
}

function validateReturnDate()
{
    let date = document.getElementById("returnDate").value;
    let pickupDate = document.getElementById("pickupDate").value;
    let Error = document.getElementById("ReturnDateError");
    if (date == "")
    {
        Error.innerHTML = "Please Select The Return Date";
        return false;
    }
    else if (pickupDate != "" && date < pickupDate)
    {
        Error.innerHTML = "Return date cannot be before the pickup date";
        return false;
    }
    else
    {
        Error.innerHTML = "Return Date: " + date;
        return true;
    }
}

function validateReturnTime()
{
    let time = document.getElementById("returnTime").value;
    let Error = document.getElementById("ReturnTimeError");
    if (time == "")
    {
        Error.innerHTML = "Please Select The Return Time";
        return false;
    }
    else
    {
        Error.innerHTML = "Return Time: " + time;
        return true;
    }
}

// same date -> the return time must be later than the pickup time
function validateReturnOrder()
{
    let pickupDate = document.getElementById("pickupDate").value;
    let pickupTime = document.getElementById("pickupTime").value;
    let returnDate = document.getElementById("returnDate").value;
    let returnTime = document.getElementById("returnTime").value;
    let Error = document.getElementById("ReturnTimeError");

    if (pickupDate == "" || pickupTime == "" || returnDate == "" || returnTime == "")
    {
        return false;
    }
    else if (returnDate == pickupDate && returnTime <= pickupTime)
    {
        Error.innerHTML = "Return time must be after the pickup time";
        return false;
    }
    else
    {
        return true;
    }
}
