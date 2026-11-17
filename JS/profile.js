// ===== JS/profile.js - manager profile for profile.html (MEMBER 3) =====
// This file is loaded only by Pages/profile.html, so it holds only the profile
// form checks and the profile work. The data is kept in localStorage
// (the shared team keys below).
// The page first checks wf_session: the session role must be "manager".
//
// Pages/profile.html
//   profileForm   ProfileName + ProfileNameError, ProfileEmail + ProfileEmailError,
//                 ProfileRole + ProfileRoleError, ProfileStatus + ProfileStatusError,
//                 ProfilePassword + ProfilePasswordError, ProfileConfirm + ProfileConfirmError
//   rules: name entered, email correct format and not used by another account,
//          a role and a status must be selected,
//          new password may stay empty (keep the old one) but must be 6+ characters if typed, confirm must match
//
// localStorage keys (team plan): wf_users, wf_session

let usersKey = "wf_users";
let sessionKey = "wf_session";

document.addEventListener("DOMContentLoaded", function () {
    if (!checkAccess()) {
        return;
    }

    let profileForm = document.getElementById("profileForm");
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (checkProfileForm()) {
            saveProfile();
        }
    });
    profileForm.addEventListener("reset", function () {
        setTimeout(resetProfileForm, 0);
    });
    renderProfile();
});

/* ---------- access: the page needs a manager session ---------- */
function checkAccess() {
    let session = getSession();
    let app = document.getElementById("app");

    if (session === null || session.role !== "manager") {
        if (app) {
            app.innerHTML = '<div class="panel">' +
                "<h3> Access Denied </h3>" +
                "<p> You must log in with a Manager account to access this page. </p>" +
                '<a class="btn" href="managerlogin.html"> Go to Login </a>' +
                "</div>";
        }
        return false;
    }

    let userName = document.getElementById("userName");
    if (userName) {
        userName.innerHTML = escapeHtml(getManagerName());
    }
    return true;
}

function getManagerName() {
    let session = getSession();
    if (session === null) {
        return "Manager";
    }
    let user = findById(readList(usersKey), session.userId);
    if (user) {
        return user.name;
    }
    return "Manager";
}

/* ---------- profile.html: checks ---------- */
function checkProfileName() {
    if (document.getElementById("ProfileName").value.trim() === "") {
        return wrong("ProfileNameError", "Please enter your name");
    }
    return right("ProfileNameError");
}

function checkProfileRole() {
    if (document.getElementById("ProfileRole").value === "") {
        return wrong("ProfileRoleError", "Please select the role");
    }
    return right("ProfileRoleError");
}

function checkProfileStatus() {
    if (document.getElementById("ProfileStatus").value === "") {
        return wrong("ProfileStatusError", "Please select the status");
    }
    return right("ProfileStatusError");
}

function checkProfilePassword() {
    let pass = document.getElementById("ProfilePassword").value;
    if (pass === "") {
        return right("ProfilePasswordError");
    }
    if (pass.length < 6) {
        return wrong("ProfilePasswordError", "Password Must be at least 6 Char");
    }
    return right("ProfilePasswordError");
}

function checkProfileConfirm() {
    let pass = document.getElementById("ProfilePassword").value;
    let confirm = document.getElementById("ProfileConfirm").value;
    if (confirm !== pass) {
        return wrong("ProfileConfirmError", "Passwords do not match");
    }
    return right("ProfileConfirmError");
}

function checkProfileForm() {
    let results = [
        checkProfileName(),
        checkEmail("ProfileEmail", "ProfileEmailError", "Enter The Email"),
        checkProfileRole(),
        checkProfileStatus(),
        checkProfilePassword(),
        checkProfileConfirm()
    ];
    return passed(results);
}

/* ---------- profile.html: manager profile ---------- */
function getCurrentManager() {
    let session = getSession();
    if (session === null) {
        return null;
    }
    return findById(readList(usersKey), session.userId);
}

function renderProfile() {
    let user = getCurrentManager();

    if (!user) {
        showMessage("Manager account could not be found.", true);
        return;
    }

    document.getElementById("ProfileName").value = user.name || "";
    document.getElementById("ProfileEmail").value = user.email || "";
    document.getElementById("ProfileRole").value = user.role || "manager";
    document.getElementById("ProfileStatus").value = user.status || "active";
    document.getElementById("ProfilePassword").value = "";
    document.getElementById("ProfileConfirm").value = "";
    clearErrors();
}

function saveProfile() {
    let users = readList(usersKey);
    // the manager must be found in this same list, so the changes below are the ones that get saved
    let session = getSession();
    let user = session === null ? null : findById(users, session.userId);

    if (!user) {
        showMessage("Manager account could not be found.", true);
        return;
    }

    let email = document.getElementById("ProfileEmail").value.trim();
    let emailAlreadyUsed = false;
    for (let i = 0; i < users.length; i++) {
        if (Number(users[i].id) !== Number(user.id) &&
            String(users[i].email).toLowerCase() === email.toLowerCase()) {
            emailAlreadyUsed = true;
        }
    }
    if (emailAlreadyUsed) {
        wrong("ProfileEmailError", "This email address is already used by another account");
        return;
    }

    user.name = document.getElementById("ProfileName").value.trim();
    user.email = email;
    user.role = document.getElementById("ProfileRole").value;
    user.status = document.getElementById("ProfileStatus").value;

    let password = document.getElementById("ProfilePassword").value;
    if (password !== "") {
        if (Object.prototype.hasOwnProperty.call(user, "pw") &&
            !Object.prototype.hasOwnProperty.call(user, "password")) {
            user.pw = password;
        } else {
            user.password = password;
        }
    }

    saveList(usersKey, users);

    // keep the session role in step with the saved role
    if (session !== null) {
        session.role = user.role;
        localStorage.setItem(sessionKey, JSON.stringify(session));
    }

    let userName = document.getElementById("userName");
    if (userName) {
        userName.innerHTML = escapeHtml(user.name);
    }

    document.getElementById("ProfilePassword").value = "";
    document.getElementById("ProfileConfirm").value = "";

    showMessage("Profile updated successfully.", false);
}

function resetProfileForm() {
    renderProfile();
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

function passed(results) {
    let allCorrect = true;
    for (let i = 0; i < results.length; i++) {
        if (results[i] === false) {
            allCorrect = false;
        }
    }
    return allCorrect;
}

// clear every error text on the page
function clearErrors() {
    let texts = document.querySelectorAll(".error");
    for (let i = 0; i < texts.length; i++) {
        texts[i].innerHTML = "";
    }
}

// show a result message at the top of the page (red when isError is true)
function showMessage(message, isError) {
    let messageBox = document.getElementById("msg");
    if (messageBox) {
        messageBox.innerHTML = '<span class="' + (isError ? "bad" : "ok") + '">' + escapeHtml(message) + "</span>";
    }
}

// keep user text safe when it is written into the page
function escapeHtml(value) {
    if (value === null || value === undefined) {
        value = "";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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

function findById(data, id) {
    for (let i = 0; i < data.length; i++) {
        if (Number(data[i].id) === Number(id)) {
            return data[i];
        }
    }
    return null;
}

function getSession() {
    let sessionData = localStorage.getItem(sessionKey);

    if (sessionData === null) {
        return null;
    }

    try {
        return JSON.parse(sessionData);
    } catch (error) {
        return null;
    }
}
