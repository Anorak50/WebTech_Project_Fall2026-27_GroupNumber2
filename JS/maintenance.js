// ===== JS/maintenance.js - maintenance log for maintenance.html (MEMBER 3) =====
// This file is loaded only by Pages/maintenance.html, so it holds only the
// maintenance form checks and the maintenance log work. The data is kept in
// localStorage (the shared team keys below).
// The page first checks wf_session: the session role must be "manager".
//
// Pages/maintenance.html
//   maintenanceForm   MaintenanceCar (dropdown) + MaintenanceCarError, MaintenanceNote + MaintenanceNoteError,
//                     MaintenanceDate + MaintenanceDateError
//   rules: a car selected, a note entered, a date selected. Adding a record sets the car to Maintenance,
//          and deleting the last record for a car sets it back to Available.
//
// localStorage keys (team plan): wf_users, wf_cars, wf_maintenance, wf_session

let maintenanceKey = "wf_maintenance";
let carsKey = "wf_cars";
let usersKey = "wf_users";
let sessionKey = "wf_session";

document.addEventListener("DOMContentLoaded", function () {
    if (!checkAccess()) {
        return;
    }

    document.getElementById("MaintenanceDate").value = today();
    document.getElementById("maintenanceForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (checkMaintenanceForm()) {
            saveMaintenance();
        }
    });
    renderMaintenance();
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

/* ---------- maintenance.html: checks ---------- */
function checkMaintenanceForm() {
    let results = [
        checkSelect("MaintenanceCar", "MaintenanceCarError", "Please select a car"),
        checkNote(),
        checkDate()
    ];
    return passed(results);
}

function checkNote() {
    if (document.getElementById("MaintenanceNote").value.trim() === "") {
        return wrong("MaintenanceNoteError", "Please enter the maintenance note");
    }
    return right("MaintenanceNoteError");
}

function checkDate() {
    if (document.getElementById("MaintenanceDate").value === "") {
        return wrong("MaintenanceDateError", "Please select the maintenance date");
    }
    return right("MaintenanceDateError");
}

/* ---------- maintenance.html: maintenance log ---------- */
function fillMaintenanceCars() {
    let carSelect = document.getElementById("MaintenanceCar");
    if (!carSelect) {
        return;
    }
    let cars = readList(carsKey);
    let options = '<option value=""> Select a car </option>';
    for (let i = 0; i < cars.length; i++) {
        options += '<option value="' + cars[i].id + '"> ' + escapeHtml(cars[i].name) + " (" + escapeHtml(cars[i].status) + ") </option>";
    }
    carSelect.innerHTML = options;
}

function renderMaintenance() {
    let maintenance = readList(maintenanceKey);
    let cars = readList(carsKey);
    let rows = document.getElementById("maintenanceRows");

    fillMaintenanceCars();

    if (maintenance.length === 0) {
        rows.innerHTML = '<tr><td colspan="6" class="empty"> No maintenance records found. </td></tr>';
        return;
    }

    let tableRows = "";
    for (let i = 0; i < maintenance.length; i++) {
        let record = maintenance[i];
        let car = findById(cars, record.carId);
        let carName = car ? car.name : "Car not found";
        let carStatus = car ? car.status : "Unknown";

        tableRows += "<tr>" +
            "<td>" + record.id + "</td>" +
            "<td>" + escapeHtml(carName) + "</td>" +
            "<td>" + escapeHtml(record.note) + "</td>" +
            "<td>" + escapeHtml(record.date) + "</td>" +
            "<td>" + statusBadge(carStatus) + "</td>" +
            "<td>" + '<button type="button" class="btn-red" onclick="deleteMaintenance(' + Number(record.id) + ')"> Delete </button>' + "</td>" +
            "</tr>";
    }
    rows.innerHTML = tableRows;
}

function saveMaintenance() {
    let carId = document.getElementById("MaintenanceCar").value;
    let cars = readList(carsKey);
    let car = findById(cars, carId);

    if (!car) {
        wrong("MaintenanceCarError", "Selected car could not be found");
        return;
    }

    let maintenance = readList(maintenanceKey);
    let record = {
        id: getNextId(maintenance),
        carId: Number(carId),
        note: document.getElementById("MaintenanceNote").value.trim(),
        date: document.getElementById("MaintenanceDate").value
    };

    maintenance.push(record);
    car.status = "Maintenance";

    saveList(maintenanceKey, maintenance);
    saveList(carsKey, cars);

    document.getElementById("maintenanceForm").reset();
    document.getElementById("MaintenanceDate").value = today();
    renderMaintenance();
    showMessage("Maintenance record added. Car status changed to Maintenance.", false);
}

function deleteMaintenance(id) {
    if (!confirm("Are you sure you want to delete this maintenance record?")) {
        return;
    }

    let maintenance = readList(maintenanceKey);
    let record = findById(maintenance, id);

    if (!record) {
        showMessage("Maintenance record could not be found.", true);
        return;
    }

    let keptRecords = [];
    for (let i = 0; i < maintenance.length; i++) {
        if (Number(maintenance[i].id) !== Number(id)) {
            keptRecords.push(maintenance[i]);
        }
    }
    maintenance = keptRecords;

    // deleting the last record for a car under maintenance makes the car available again
    let cars = readList(carsKey);
    let car = findById(cars, record.carId);
    if (car && car.status === "Maintenance") {
        let anotherRecord = false;
        for (let i = 0; i < maintenance.length; i++) {
            if (Number(maintenance[i].carId) === Number(record.carId)) {
                anotherRecord = true;
            }
        }
        if (!anotherRecord) {
            car.status = "Available";
        }
    }

    saveList(maintenanceKey, maintenance);
    saveList(carsKey, cars);
    renderMaintenance();
    showMessage("Maintenance record deleted.", false);
}

function today() {
    let date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
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

// a dropdown must have a real option selected
function checkSelect(selectId, errorId, text) {
    if (document.getElementById(selectId).value === "") {
        return wrong(errorId, text);
    }
    return right(errorId);
}

/* ---------- status badges ---------- */
function statusBadge(status) {
    let safeStatus = String(status || "Unknown");
    let className = safeStatus.toLowerCase().replace(/[^a-z]/g, "");
    return '<span class="badge st-' + className + '">' + escapeHtml(safeStatus) + "</span>";
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

function getNextId(data) {
    let highestId = 0;
    for (let i = 0; i < data.length; i++) {
        if (Number(data[i].id) > highestId) {
            highestId = Number(data[i].id);
        }
    }
    return highestId + 1;
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
