// ===== JS/manager.js - fleet page work for manager.html (MEMBER 3) =====
// This file is loaded only by Pages/manager.html, so it holds only the fleet form checks
// and the fleet work. The data is kept in localStorage (the shared team keys below).
// The page first checks wf_session: the session role must be "manager".
//
// Pages/manager.html (fleet)
//   carForm   CarName + CarNameError, CarType (dropdown) + CarTypeError, CarSeats + CarSeatsError,
//             CarPrice + CarPriceError, CarBranch (dropdown) + CarBranchError, CarStatus (dropdown, no rule), CarId (hidden)
//   rules: car name entered, car type selected, seats a whole number greater than zero, price greater than zero,
//          branch selected (the branch list is seeded with the three Wayfare branches when wf_branches is empty)
//   carSearch filters the fleet table (tbody id carRows); the counts go in totalCars, availableCars, bookedCars, maintenanceCars
//
// localStorage keys (team plan): wf_users, wf_cars, wf_bookings, wf_branches, wf_session

let carsKey = "wf_cars";
let bookingsKey = "wf_bookings";
let usersKey = "wf_users";
let branchesKey = "wf_branches";
let sessionKey = "wf_session";

document.addEventListener("DOMContentLoaded", function () {
    if (!checkAccess()) {
        return;
    }

    seedBranches();
    fillBranchOptions("");
    renderFleet();

    let carForm = document.getElementById("carForm");
    carForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (checkCarForm()) {
            saveCar();
        }
    });
    carForm.addEventListener("reset", function () {
        setTimeout(updateCarFormState, 0);
    });
    document.getElementById("carSearch").addEventListener("input", renderFleet);
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

/* ---------- manager.html: fleet checks ---------- */
function checkCarName() {
    if (document.getElementById("CarName").value.trim() === "") {
        return wrong("CarNameError", "Please enter the car name");
    }
    return right("CarNameError");
}

function checkSeats() {
    let seats = document.getElementById("CarSeats").value.trim();
    if (seats === "" || Number(seats) < 1 || !Number.isInteger(Number(seats))) {
        return wrong("CarSeatsError", "Seats must be a whole number greater than zero");
    }
    return right("CarSeatsError");
}

function checkPrice() {
    let price = document.getElementById("CarPrice").value.trim();
    if (price === "" || Number(price) <= 0) {
        return wrong("CarPriceError", "Price per day must be greater than zero");
    }
    return right("CarPriceError");
}

function checkCarForm() {
    let results = [
        checkCarName(),
        checkSelect("CarType", "CarTypeError", "Please select the car type"),
        checkSeats(),
        checkPrice(),
        checkSelect("CarBranch", "CarBranchError", "Please select the branch")
    ];
    return passed(results);
}

/* ---------- manager.html: fleet ---------- */
// the three Wayfare branches (the same branches a manager picks at registration);
// they are saved to wf_branches only when no branch list exists yet, so branches
// added later (for example by the admin) are never overwritten
function seedBranches() {
    if (readList(branchesKey).length > 0) {
        return;
    }
    saveList(branchesKey, [
        { id: 1, name: "Airport Branch", city: "Dhaka" },
        { id: 2, name: "Downtown Branch", city: "Chattogram" },
        { id: 3, name: "Lake Branch", city: "Sylhet" }
    ]);
}

function fillBranchOptions(selectedValue) {
    let branchSelect = document.getElementById("CarBranch");
    if (!branchSelect) {
        return;
    }
    let branches = readList(branchesKey);
    let options = '<option value=""> No branch assigned </option>';
    for (let i = 0; i < branches.length; i++) {
        let branch = branches[i];
        let selected = Number(selectedValue) === Number(branch.id) ? " selected" : "";
        options += '<option value="' + branch.id + '"' + selected + "> " + escapeHtml(branch.name) + " - " + escapeHtml(branch.city) + " </option>";
    }
    branchSelect.innerHTML = options;
}

function renderFleet() {
    let cars = readList(carsKey);
    let rows = document.getElementById("carRows");

    let available = 0;
    let booked = 0;
    let maintenance = 0;
    for (let i = 0; i < cars.length; i++) {
        if (cars[i].status === "Available") {
            available++;
        }
        if (cars[i].status === "Booked") {
            booked++;
        }
        if (cars[i].status === "Maintenance") {
            maintenance++;
        }
    }
    document.getElementById("totalCars").innerHTML = cars.length;
    document.getElementById("availableCars").innerHTML = available;
    document.getElementById("bookedCars").innerHTML = booked;
    document.getElementById("maintenanceCars").innerHTML = maintenance;

    let searchBox = document.getElementById("carSearch");
    let searchText = searchBox ? searchBox.value.trim().toLowerCase() : "";

    let tableRows = "";
    let found = 0;
    for (let i = 0; i < cars.length; i++) {
        let car = cars[i];
        if (String(car.name).toLowerCase().indexOf(searchText) === -1) {
            continue;
        }
        found++;
        tableRows += "<tr>" +
            "<td>" + car.id + "</td>" +
            "<td>" + escapeHtml(car.name) + "</td>" +
            "<td>" + escapeHtml(car.type) + "</td>" +
            "<td>" + escapeHtml(car.seats) + "</td>" +
            "<td>" + formatPrice(car.pricePerDay) + "</td>" +
            "<td>" + escapeHtml(getBranchName(car.branchId)) + "</td>" +
            "<td>" + statusBadge(car.status) + "</td>" +
            "<td>" +
            '<button type="button" class="btn-grey" onclick="editCar(' + Number(car.id) + ')"> Edit </button> ' +
            '<button type="button" class="btn-red" onclick="deleteCar(' + Number(car.id) + ')"> Delete </button>' +
            "</td>" +
            "</tr>";
    }

    if (found === 0) {
        rows.innerHTML = '<tr><td colspan="8" class="empty"> No cars found. </td></tr>';
        return;
    }
    rows.innerHTML = tableRows;
}

function saveCar() {
    let carId = document.getElementById("CarId").value;
    let cars = readList(carsKey);
    let carData = {
        name: document.getElementById("CarName").value.trim(),
        type: document.getElementById("CarType").value,
        seats: Number(document.getElementById("CarSeats").value.trim()),
        pricePerDay: Number(document.getElementById("CarPrice").value.trim()),
        branchId: document.getElementById("CarBranch").value === "" ? null : Number(document.getElementById("CarBranch").value),
        status: document.getElementById("CarStatus").value
    };

    if (carId === "") {
        carData.id = getNextId(cars);
        cars.push(carData);
        showMessage("Car added successfully.", false);
    } else {
        let car = findById(cars, carId);
        if (!car) {
            showMessage("Car could not be found.", true);
            return;
        }
        car.name = carData.name;
        car.type = carData.type;
        car.seats = carData.seats;
        car.pricePerDay = carData.pricePerDay;
        car.branchId = carData.branchId;
        car.status = carData.status;
        showMessage("Car information updated successfully.", false);
    }

    saveList(carsKey, cars);
    resetCarForm();
    renderFleet();
}

function editCar(id) {
    let car = findById(readList(carsKey), id);
    if (!car) {
        showMessage("Car could not be found.", true);
        return;
    }

    document.getElementById("CarId").value = car.id;
    document.getElementById("CarName").value = car.name;
    document.getElementById("CarType").value = car.type;
    document.getElementById("CarSeats").value = car.seats;
    document.getElementById("CarPrice").value = car.pricePerDay;
    fillBranchOptions(car.branchId);
    document.getElementById("CarStatus").value = car.status;
    document.getElementById("carFormTitle").innerHTML = "Edit Car";
    document.getElementById("carSubmit").value = "Update Car";
    clearErrors();

    document.getElementById("carForm").scrollIntoView({ behavior: "smooth" });
}

function updateCarFormState() {
    document.getElementById("CarId").value = "";
    document.getElementById("carFormTitle").innerHTML = "Add New Car";
    document.getElementById("carSubmit").value = "Add Car";
    clearErrors();
    fillBranchOptions("");
}

function resetCarForm() {
    let form = document.getElementById("carForm");
    if (form) {
        form.reset();
    }
    updateCarFormState();
}

function deleteCar(id) {
    let cars = readList(carsKey);
    let bookings = readList(bookingsKey);

    let activeBooking = false;
    for (let i = 0; i < bookings.length; i++) {
        if (Number(bookings[i].carId) === Number(id) &&
            (bookings[i].status === "Pending" || bookings[i].status === "Approved" || bookings[i].status === "Started")) {
            activeBooking = true;
        }
    }
    if (activeBooking) {
        showMessage("This car has an active booking and cannot be deleted.", true);
        return;
    }

    if (!confirm("Are you sure you want to delete this car?")) {
        return;
    }

    let keptCars = [];
    for (let i = 0; i < cars.length; i++) {
        if (Number(cars[i].id) !== Number(id)) {
            keptCars.push(cars[i]);
        }
    }
    saveList(carsKey, keptCars);
    renderFleet();
    showMessage("Car deleted successfully.", false);
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

// a dropdown must have a real option selected
function checkSelect(selectId, errorId, text) {
    if (document.getElementById(selectId).value === "") {
        return wrong(errorId, text);
    }
    return right(errorId);
}

/* ---------- status badges and names ---------- */
function statusBadge(status) {
    let safeStatus = String(status || "Unknown");
    let className = safeStatus.toLowerCase().replace(/[^a-z]/g, "");
    return '<span class="badge st-' + className + '">' + escapeHtml(safeStatus) + "</span>";
}

function getBranchName(branchId) {
    let branch = findById(readList(branchesKey), branchId);
    if (branch) {
        return branch.name;
    }
    return branchId ? "Unknown branch" : "Not assigned";
}

function formatPrice(price) {
    let amount = Number(price);
    if (Number.isNaN(amount)) {
        amount = 0;
    }
    return "$" + amount.toFixed(2);
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
