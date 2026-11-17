// ===== JS/managerlogin.js - manager login for the manager login page (MEMBER 3) =====
// The form is validated first (the project rules below). When the format is
// correct, the account is looked up in wf_users: if the email and password
// match a manager account, wf_session is saved and the portal opens.
// The demo manager account (manager@wf.com) is seeded when it is missing,
// so the demo link on the page always works.
//
// Pages/managerlogin.html
//   managerLoginForm   MgrLoginEmail + MgrLoginEmailError, MgrLoginPassword + MgrLoginPasswordError, MgrLoginMsg (the result line)
//   rules: email required + correct format; password required, 6+ characters with a letter and a number
//
// localStorage keys (team plan): wf_users, wf_session

let usersKey = "wf_users";
let sessionKey = "wf_session";

document.addEventListener("DOMContentLoaded", function () {
    hookForm("managerLoginForm", checkManagerLoginForm);
    seedDemoManager();

    let demoLink = document.getElementById("demoLink");
    if (demoLink) {
        demoLink.addEventListener("click", function () {
            seedDemoManager();
            let demo = findUserByEmail(readList(usersKey), "manager@wf.com");
            if (demo) {
                localStorage.setItem(sessionKey, JSON.stringify({ userId: demo.id, role: demo.role }));
            }
        });
    }
});

/* ---------- managerlogin.html ---------- */
function checkManagerLoginForm() {
    let results = [
        checkEmail("MgrLoginEmail", "MgrLoginEmailError", "Please Enter The Email"),
        checkPassword("MgrLoginPassword", "MgrLoginPasswordError", "Please Enter The Password")
    ];
    if (!passed(results)) {
        finish("MgrLoginMsg", results, "Login form is correct", "Please fix the errors above");
        return;
    }
    loginManager();
}

// check the account in wf_users and, when it is a manager account, start the session
function loginManager() {
    seedDemoManager();

    let email = document.getElementById("MgrLoginEmail").value.trim();
    let password = document.getElementById("MgrLoginPassword").value;
    let user = findUserByEmail(readList(usersKey), email);
    let msg = document.getElementById("MgrLoginMsg");

    if (user === null || userPassword(user) !== password) {
        msg.innerHTML = "Invalid email or password";
        msg.style.color = "red";
        return;
    }
    if (user.role !== "manager") {
        msg.innerHTML = "This account is not a manager account";
        msg.style.color = "red";
        return;
    }
    if (user.status !== "active") {
        msg.innerHTML = "This account is not active";
        msg.style.color = "red";
        return;
    }

    localStorage.setItem(sessionKey, JSON.stringify({ userId: user.id, role: user.role }));
    msg.innerHTML = "Login successful";
    msg.style.color = "green";
    window.location.href = "manager.html";
}

// the demo manager account must exist, or nobody can enter the portal on a fresh browser
function seedDemoManager() {
    let users = readList(usersKey);
    if (findUserByEmail(users, "manager@wf.com") !== null) {
        return;
    }
    users.push({
        id: nextId(users),
        name: "Demo Manager",
        email: "manager@wf.com",
        password: "manager123",
        role: "manager",
        status: "active"
    });
    saveList(usersKey, users);
}

function userPassword(user) {
    if (Object.prototype.hasOwnProperty.call(user, "password")) {
        return user.password;
    }
    if (Object.prototype.hasOwnProperty.call(user, "pw")) {
        return user.pw;
    }
    return "";
}

/* ---------- small helpers ---------- */
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

/* ---------- localStorage data (the shared team keys) ---------- */
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
