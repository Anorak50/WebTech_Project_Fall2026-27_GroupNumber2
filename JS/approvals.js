let bookingsKey = "wf_bookings";
let carsKey = "wf_cars";
let usersKey = "wf_users";
let leavesKey = "wf_leaves";
let sessionKey = "wf_session";

let bookingFilter = "";

document.addEventListener("DOMContentLoaded", function () {
    if (!checkAccess()) {
        return;
    }

    document.getElementById("bookingFilter").addEventListener("change", filterBookings);
    renderApprovals();
});

// manager session  
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

// booking approvals and driver assignment
function getAvailableDrivers(booking) {
    let users = readList(usersKey);
    let leaves = readList(leavesKey);
    let availableDrivers = [];

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.role !== "driver" || user.status !== "active") {
            continue;
        }
        let onLeave = false;
        for (let j = 0; j < leaves.length; j++) {
            if (Number(leaves[j].driverId) === Number(user.id) &&
                leaves[j].status === "Approved" &&
                leaves[j].date >= booking.start &&
                leaves[j].date <= booking.end) {
                onLeave = true;
            }
        }
        if (!onLeave) {
            availableDrivers.push(user);
        }
    }
    return availableDrivers;
}

function driverOptions(booking) {
    let drivers = getAvailableDrivers(booking);
    let options = '<option value=""> No driver assigned </option>';

    let currentDriver = null;
    for (let i = 0; i < drivers.length; i++) {
        if (Number(drivers[i].id) === Number(booking.driverId)) {
            currentDriver = drivers[i];
        }
    }

    // the driver saved on the booking is no longer active or available keep him visible, but disabled
    if (booking.driverId && currentDriver === null) {
        let oldDriver = findById(readList(usersKey), booking.driverId);
        if (oldDriver) {
            options += '<option value="' + oldDriver.id + '" selected disabled> ' + escapeHtml(oldDriver.name) + " (not active/available) </option>";
        }
    }

    for (let i = 0; i < drivers.length; i++) {
        let driver = drivers[i];
        let selected = Number(driver.id) === Number(booking.driverId) ? " selected" : "";
        options += '<option value="' + driver.id + '"' + selected + "> " + escapeHtml(driver.name) + " </option>";
    }
    return options;
}

function renderApprovals() {
    let bookings = readList(bookingsKey);
    let rows = document.getElementById("bookingRows");
    let filter = document.getElementById("bookingFilter");

    if (filter) {
        bookingFilter = filter.value;
    }

    let tableRows = "";
    let found = 0;
    for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];
        if (bookingFilter !== "" && booking.status !== bookingFilter) {
            continue;
        }
        found++;

        let driverCell = "";
        let actionCell = "";
        if (booking.status === "Pending" || booking.status === "Approved") {
            driverCell = '<select id="driver_' + booking.id + '">' + driverOptions(booking) + "</select>";
            if (booking.status === "Pending") {
                actionCell = '<button type="button" class="btn" onclick="approveBooking(' + Number(booking.id) + ')"> Approve </button> ' +
                    '<button type="button" class="btn-red" onclick="rejectBooking(' + Number(booking.id) + ')"> Reject </button>';
            } else {
                actionCell = '<button type="button" class="btn-grey" onclick="assignDriver(' + Number(booking.id) + ')"> Save Driver </button>';
            }
        } else {
            driverCell = escapeHtml(getUserNameById(booking.driverId));
            actionCell = '<span class="muted"> No action </span>';
        }

        tableRows += "<tr>" +
            "<td>" + booking.id + "</td>" +
            "<td>" + escapeHtml(getUserNameById(booking.customerId)) + "</td>" +
            "<td>" + escapeHtml(getCarNameById(booking.carId)) + "</td>" +
            "<td>" + escapeHtml(booking.start) + " to " + escapeHtml(booking.end) + "</td>" +
            "<td>" + formatPrice(booking.total) + "</td>" +
            "<td>" + statusBadge(booking.status) + "</td>" +
            "<td>" + driverCell + "</td>" +
            "<td>" + actionCell + "</td>" +
            "</tr>";
    }

    if (found === 0) {
        rows.innerHTML = '<tr><td colspan="8" class="empty"> No bookings found for this status. </td></tr>';
        return;
    }
    rows.innerHTML = tableRows;
}

function getSelectedDriverId(bookingId) {
    let select = document.getElementById("driver_" + bookingId);
    if (!select || select.value === "") {
        return null;
    }
    return Number(select.value);
}

function driverIsAvailable(booking, driverId) {
    let drivers = getAvailableDrivers(booking);
    for (let i = 0; i < drivers.length; i++) {
        if (Number(drivers[i].id) === Number(driverId)) {
            return true;
        }
    }
    return false;
}

function approveBooking(id) {
    let bookings = readList(bookingsKey);
    let cars = readList(carsKey);
    let booking = findById(bookings, id);

    if (!booking || booking.status !== "Pending") {
        showMessage("This booking is no longer pending.", true);
        return;
    }

    let car = findById(cars, booking.carId);
    if (!car) {
        showMessage("The car for this booking could not be found.", true);
        return;
    }
    if (car.status === "Maintenance") {
        showMessage("This car is under maintenance and cannot be approved.", true);
        return;
    }

    let driverId = getSelectedDriverId(id);
    if (driverId !== null && !driverIsAvailable(booking, driverId)) {
        showMessage("Please select an active driver who is not on approved leave.", true);
        return;
    }

    booking.status = "Approved";
    booking.driverId = driverId;
    car.status = "Booked";

    saveList(bookingsKey, bookings);
    saveList(carsKey, cars);
    renderApprovals();
    showMessage("Booking approved successfully.", false);
}

function rejectBooking(id) {
    if (!confirm("Are you sure you want to reject this booking?")) {
        return;
    }

    let bookings = readList(bookingsKey);
    let booking = findById(bookings, id);

    if (!booking || booking.status !== "Pending") {
        showMessage("This booking is no longer pending.", true);
        return;
    }

    booking.status = "Rejected";
    booking.driverId = null;

    saveList(bookingsKey, bookings);
    renderApprovals();
    showMessage("Booking rejected.", false);
}

function assignDriver(id) {
    let bookings = readList(bookingsKey);
    let booking = findById(bookings, id);

    if (!booking || booking.status !== "Approved") {
        showMessage("A driver can only be assigned to an approved booking.", true);
        return;
    }

    let driverId = getSelectedDriverId(id);
    if (driverId !== null && !driverIsAvailable(booking, driverId)) {
        showMessage("Please select an active driver who is not on approved leave.", true);
        return;
    }

    booking.driverId = driverId;
    saveList(bookingsKey, bookings);
    renderApprovals();
    showMessage("Driver assignment updated.", false);
}

function filterBookings() {
    let filter = document.getElementById("bookingFilter");
    bookingFilter = filter ? filter.value : "";
    renderApprovals();
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

//status badges and names
function statusBadge(status) {
    let safeStatus = String(status || "Unknown");
    let className = safeStatus.toLowerCase().replace(/[^a-z]/g, "");
    return '<span class="badge st-' + className + '">' + escapeHtml(safeStatus) + "</span>";
}

function getUserNameById(userId) {
    let user = findById(readList(usersKey), userId);
    if (user) {
        return user.name;
    }
    return "Not assigned";
}

function getCarNameById(carId) {
    let car = findById(readList(carsKey), carId);
    if (car) {
        return car.name;
    }
    return "Car not found";
}

function formatPrice(price) {
    let amount = Number(price);
    if (Number.isNaN(amount)) {
        amount = 0;
    }
    return "$" + amount.toFixed(2);
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
