document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("driverLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            if (!collect_login()) {
                event.preventDefault();
            }
        });
    }

    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            if (!collect_profile()) {
                event.preventDefault();
            }
        });
    }

    const passwordForm = document.getElementById("passwordForm");
    if (passwordForm) {
        passwordForm.addEventListener("submit", function (event) {
            if (!collect_password()) {
                event.preventDefault();
            }
        });
    }

    const leaveForm = document.getElementById("leaveForm");
    if (leaveForm) {
        leaveForm.addEventListener("submit", function (event) {
            if (!collect_leave()) {
                event.preventDefault();
            }
        });
    }

    const registerForm = document.getElementById("driverRegisterForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            if (!collect_register()) {
                event.preventDefault();
            }
        });
    }
});


function collect_login()
{
    let validateEmail = validEmail("DrvLoginEmail", "DrvLoginEmailError", "Please Enter The Email");
    let validatePass = validPassword("DrvLoginPassword", "DrvLoginPasswordError", "Please Enter The Password");

    return validateEmail && validatePass;
}

function collect_profile()
{
    let validName = validateName("DriverName", "DriverNameError");
    let validateEmail = validEmail("DriverEmail", "DriverEmailError", "Enter The Email");
    let validatePhone = validPhone("DriverPhone", "DriverPhoneError");
    let validateAge = validRange("DriverAge", "DriverAgeError", 21, 65, "Age");
    let validategender = validateGender("gender", "DriverGenderError");
    let validLicense = validateSelect("DriverLicense", "DriverLicenseError", "Please Select The License Type");

    return validName && validateEmail && validatePhone && validateAge && validategender && validLicense;
}

function collect_password()
{
    let validatePass = validPassword("NewPassword", "NewPasswordError", "Enter The New Password");
    let validateConfirm = validConfirm("NewPassword", "ConfirmPassword", "ConfirmPasswordError");

    return validatePass && validateConfirm;
}

function collect_leave()
{
    let validType = validateSelect("LeaveType", "LeaveTypeError", "Please Select The Leave Type");
    let validateDate = validDate("LeaveDate", "LeaveDateError");
    let validateDuration = validateRadio("duration", "LeaveDurationError", "Please Select Full day or Half day");
    let validateReason = validReason("LeaveReason", "LeaveReasonError");

    return validType && validateDate && validateDuration && validateReason;
}

function collect_register()
{
    let validName = validateName("DrvName", "DrvNameError");
    let validateEmail = validEmail("DrvEmail", "DrvEmailError", "Enter Your Email");
    let validatePhone = validPhone("DrvPhone", "DrvPhoneError");
    let validateAge = validRange("DrvAge", "DrvAgeError", 21, 65, "Age");
    let validategender = validateGender("drvGender", "DrvGenderError");
    let validType = validateSelect("DrvLicenseType", "DrvLicenseTypeError", "Please Select The License Type");
    let validLicense = validateLicenseNo();
    let validateExperience = validRange("DrvExperience", "DrvExperienceError", 0, 40, "Years of experience");
    let validCity = validateSelect("DrvCity", "DrvCityError", "Please Select A City");
    let validatePass = validPassword("DrvPassword", "DrvPasswordError", "Enter The Password");
    let validateConfirm = validConfirm("DrvPassword", "DrvConfirm", "DrvConfirmError");
    let validTerms = validateTick("DrvTerms", "DrvTermsError", "You must agree to the driver rules");

    return validName && validateEmail && validatePhone && validateAge && validategender && validType && validLicense && validateExperience && validCity && validatePass && validateConfirm && validTerms;
}



function validateName(inputId, errorId)
{
    let Pname = document.getElementById(inputId).value.trim();
    let Error = document.getElementById(errorId);
    let regexpression = /^[A-Za-z ]+$/;
    if(Pname=="")
    {
        Error.innerHTML = "Enter Your Name";
        return false;
    }
    else if(Pname.length<3)
    {
        Error.innerHTML = "Name Must be at least 3 Char";
        return false;
    }
    else if(!regexpression.test(Pname))
    {
        Error.innerHTML = "Name can have only letters and spaces";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validEmail(inputId, errorId, emptyText)
{
    let Email = document.getElementById(inputId).value.trim();
    let Error = document.getElementById(errorId);
    let regexpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(Email=="")
    {
        Error.innerHTML = emptyText;
        return false;
    }
    else if(!regexpression.test(Email))
    {
        Error.innerHTML = "Please Enter The Right Email Format";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validPhone(inputId, errorId)
{
    let Phone = document.getElementById(inputId).value.trim();
    let Error = document.getElementById(errorId);
    let regexpression = /^01[0-9]{9}$/;
    if(Phone==="")
    {
        Error.innerHTML = "Enter Your Phone Number";
        return false;
    }
    else if(!regexpression.test(Phone))
    {
        Error.innerHTML = "Phone must be 11 digits and start with 01";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validRange(inputId, errorId, min, max, label)
{
    let Value = document.getElementById(inputId).value;
    let Error = document.getElementById(errorId);
    if(Value==="")
    {
        Error.innerHTML = "Enter The " + label;
        return false;
    }
    else if(Number(Value) < min || Number(Value) > max)
    {
        Error.innerHTML = label + " must be between " + min + " and " + max;
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validPassword(inputId, errorId, emptyText)
{
    let Pass = document.getElementById(inputId).value;
    let Error = document.getElementById(errorId);
    if(Pass==="")
    {
        Error.innerHTML = emptyText;
        return false;
    }
    else if(Pass.length<6)
    {
        Error.innerHTML = "Password Must be at least 6 Char";
        return false;
    }
    else if(!/[A-Za-z]/.test(Pass))
    {
        Error.innerHTML = "Password Must have at least one letter";
        return false;
    }
    else if(!/[0-9]/.test(Pass))
    {
        Error.innerHTML = "Password Must have at least one number";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validConfirm(passId, confirmId, errorId)
{
    let Pass = document.getElementById(passId).value;
    let Confirm = document.getElementById(confirmId).value;
    let Error = document.getElementById(errorId);
    if(Confirm==="")
    {
        Error.innerHTML = "Type The Password Again";
        return false;
    }
    else if(Confirm != Pass)
    {
        Error.innerHTML = "Passwords do not match";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateSelect(selectId, errorId, text)
{
    let Selected = document.getElementById(selectId).value;
    let Error = document.getElementById(errorId);
    if(Selected==="")
    {
        Error.innerHTML = text;
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateRadio(radioName, errorId, text)
{
    let radios = document.querySelectorAll('input[name="' + radioName + '"]');
    let Error = document.getElementById(errorId);
    let selectRadio = "";

    for(let i=0; i<radios.length; i++)
    {
        if(radios[i].checked)
        {
            selectRadio = radios[i].value;
            break;
        }
    }
    if(selectRadio==="")
    {
        Error.innerHTML = text;
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateGender(radioName, errorId)
{
    return validateRadio(radioName, errorId, "Please Select The Gender");
}

function validateTick(boxId, errorId, text)
{
    let Ticked = document.getElementById(boxId).checked;
    let Error = document.getElementById(errorId);
    if(!Ticked)
    {
        Error.innerHTML = text;
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validDate(inputId, errorId)
{
    let LeaveDate = document.getElementById(inputId).value;
    let Error = document.getElementById(errorId);
    if(LeaveDate==="")
    {
        Error.innerHTML = "Please Select The Date";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validReason(inputId, errorId)
{
    let Reason = document.getElementById(inputId).value.trim();
    let Error = document.getElementById(errorId);
    if(Reason==="")
    {
        Error.innerHTML = "Please Enter The Reason";
        return false;
    }
    else if(Reason.length<5)
    {
        Error.innerHTML = "Reason Must be at least 5 Char";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}

function validateLicenseNo()
{
    let License = document.getElementById("DrvLicenseNo").value.trim();
    let Error = document.getElementById("DrvLicenseNoError");
    let regexpression = /^[A-Z0-9]{8,15}$/;
    if(License==="")
    {
        Error.innerHTML = "Enter The License Number";
        return false;
    }
    else if(!regexpression.test(License))
    {
        Error.innerHTML = "Use capital letters and numbers only, 8 to 15 characters";
        return false;
    }
    else{
        Error.innerHTML = "";
        return true;
    }
}