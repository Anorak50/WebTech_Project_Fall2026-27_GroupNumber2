document.addEventListener("DOMContentLoaded", function () {
    hookForm("managerRegisterForm", checkManagerRegisterForm);
});

function checkManagerRegisterForm() {
    let results = [
        checkName("MgrName", "MgrNameError"),
        checkEmail("MgrEmail", "MgrEmailError", "Enter The Email"),
        checkPhone("MgrPhone", "MgrPhoneError"),
        checkRange("MgrAge", "MgrAgeError", 21, 60, "Age"),
        checkRange("MgrExperience", "MgrExperienceError", 0, 40, "Years of experience"),
        checkRadio("mgrGender", "MgrGenderError", "Please Select The Gender"),
        checkSelect("MgrBranch", "MgrBranchError", "Please Select The Branch"),
        checkPassword("MgrPassword", "MgrPasswordError", "Enter The Password"),
        checkConfirm("MgrPassword", "MgrConfirm", "MgrConfirmError"),
        checkTick("MgrTerms", "MgrTermsError", "You must agree to the code of conduct")
    ];
    if (!passed(results)) {
        finish("MgrRegMsg", results, "Registration form is correct", "Please fix the errors above");
        return;
    }
    registerManager();
}

// save the new manager account in wf_users and start the session
function registerManager() {
    let usersKey = "wf_users";
    let sessionKey = "wf_session";
    let users = readList(usersKey);
    let email = document.getElementById("MgrEmail").value.trim();
    let msg = document.getElementById("MgrRegMsg");

    if (findUserByEmail(users, email) !== null) {
        msg.innerHTML = "This email is already registered";
        msg.style.color = "red";
        return;
    }

    let gender = "";
    let radios = document.querySelectorAll('input[name="mgrGender"]');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            gender = radios[i].value;
        }
    }

    let user = {
        id: nextId(users),
        name: document.getElementById("MgrName").value.trim(),
        email: email,
        phone: document.getElementById("MgrPhone").value.trim(),
        age: Number(document.getElementById("MgrAge").value),
        experience: Number(document.getElementById("MgrExperience").value),
        gender: gender,
        branch: document.getElementById("MgrBranch").value,
        password: document.getElementById("MgrPassword").value,
        role: "manager",
        status: "active"
    };
    users.push(user);
    saveList(usersKey, users);

    localStorage.setItem(sessionKey, JSON.stringify({ userId: user.id, role: user.role }));
    msg.innerHTML = "Registration successful";
    msg.style.color = "green";
    window.location.href = "manager.html";
}


function wrong(errorId, text) {
    document.getElementById(errorId).innerHTML = text;
    return false;
}

function right(errorId) {
    document.getElementById(errorId).innerHTML = "";
    return true;
}

// true only when every check in the results list passed
function passed(results) {
    let allCorrect = true;
    for (let i = 0; i < results.length; i++) {
        if (results[i] === false) {
            allCorrect = false;
        }
    }
    return allCorrect;
}

// show one result line (green when every field is correct, red when not)
function finish(msgId, results, okText, errorText) {
    let msg = document.getElementById(msgId);
    if (passed(results)) {
        msg.innerHTML = okText;
        msg.style.color = "green";
    } else {
        msg.innerHTML = errorText;
        msg.style.color = "red";
    }
}

function hookForm(formId, checkFunction) {
    let form = document.getElementById(formId);
    if (!form) {
        return;
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        checkFunction();
    });
    form.addEventListener("reset", function () {
        let texts = document.querySelectorAll(".error, .message");
        for (let i = 0; i < texts.length; i++) {
            texts[i].innerHTML = "";
        }
    });
}

// a dropdown must have a real option selected
function checkSelect(selectId, errorId, text) {
    if (document.getElementById(selectId).value === "") {
        return wrong(errorId, text);
    }
    return right(errorId);
}

// one radio button of the group must be checked
function checkRadio(radioName, errorId, text) {
    let radios = document.querySelectorAll('input[name="' + radioName + '"]');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return right(errorId);
        }
    }
    return wrong(errorId, text);
}

// a checkbox must be ticked
function checkTick(boxId, errorId, text) {
    if (!document.getElementById(boxId).checked) {
        return wrong(errorId, text);
    }
    return right(errorId);
}

// name: 3+ characters, letters and spaces only
function checkName(inputId, errorId) {
    let name = document.getElementById(inputId).value.trim();
    let regexpression = /^[A-Za-z ]+$/;
    if (name === "") {
        return wrong(errorId, "Enter The Name");
    }
    if (name.length < 3) {
        return wrong(errorId, "Name Must be at least 3 Char");
    }
    if (!regexpression.test(name)) {
        return wrong(errorId, "Name can have only letters and spaces");
    }
    return right(errorId);
}

// email: correct email format
function checkEmail(inputId, errorId, emptyText) {
    let email = document.getElementById(inputId).value.trim();
    let regexpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        return wrong(errorId, emptyText);
    }
    if (!regexpression.test(email)) {
        return wrong(errorId, "Please Enter The Right Email Format");
    }
    return right(errorId);
}

// phone: 11 digits, starts with 01
function checkPhone(inputId, errorId) {
    let phone = document.getElementById(inputId).value.trim();
    let regexpression = /^01[0-9]{9}$/;
    if (phone === "") {
        return wrong(errorId, "Enter The Phone Number");
    }
    if (!regexpression.test(phone)) {
        return wrong(errorId, "Phone must be 11 digits and start with 01");
    }
    return right(errorId);
}

// a number must be between min and max (age, years of experience)
function checkRange(inputId, errorId, min, max, label) {
    let value = document.getElementById(inputId).value;
    if (value === "") {
        return wrong(errorId, "Enter The " + label);
    }
    if (Number(value) < min || Number(value) > max) {
        return wrong(errorId, label + " must be between " + min + " and " + max);
    }
    return right(errorId);
}

// password format: 6+ characters, at least one letter and one number
function checkPassword(inputId, errorId, emptyText) {
    let pass = document.getElementById(inputId).value;
    if (pass === "") {
        return wrong(errorId, emptyText);
    }
    if (pass.length < 6) {
        return wrong(errorId, "Password Must be at least 6 Char");
    }
    if (!/[A-Za-z]/.test(pass)) {
        return wrong(errorId, "Password Must have at least one letter");
    }
    if (!/[0-9]/.test(pass)) {
        return wrong(errorId, "Password Must have at least one number");
    }
    return right(errorId);
}

// the second password must be the same as the first
function checkConfirm(passId, confirmId, errorId) {
    let confirm = document.getElementById(confirmId).value;
    if (confirm === "") {
        return wrong(errorId, "Type The Password Again");
    }
    if (confirm !== document.getElementById(passId).value) {
        return wrong(errorId, "Passwords do not match");
    }
    return right(errorId);
}

function readList(key) {
    let storedData = localStorage.getItem(key);

    if (storedData === null) {
        return [];
    }

    try {
        let data = JSON.parse(storedData);
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        console.log("Could not read localStorage key: " + key);
        return [];
    }
}

function saveList(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function findUserByEmail(users, email) {
    for (let i = 0; i < users.length; i++) {
        if (String(users[i].email).toLowerCase() === String(email).toLowerCase()) {
            return users[i];
        }
    }
    return null;
}

function nextId(data) {
    let biggest = 0;
    for (let i = 0; i < data.length; i++) {
        if (Number(data[i].id) > biggest) {
            biggest = Number(data[i].id);
        }
    }
    return biggest + 1;
}
