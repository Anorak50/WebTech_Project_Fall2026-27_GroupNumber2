document.addEventListener("DOMContentLoaded", function () {

    //Add User Form
    let userForm = document.getElementById("userForm");
    if (userForm) {
        userForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_user_data();
        });
    }

    //Edit User Form
    let editUserForm = document.getElementById("editUserForm");
    if (editUserForm) {
        editUserForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_edit_user_data();
        });
    }

    //Add Branch Form
    let branchForm = document.getElementById("branchForm");
    if (branchForm) {
        branchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_branch_data();
        });
    }

    //Edit Branch Form
    let editBranchForm = document.getElementById("editBranchForm");
    if (editBranchForm) {
        editBranchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_edit_branch_data();
        });
    }

    //Booking Filter Form
    let bookingFilterForm = document.getElementById("bookingFilterForm");
    if (bookingFilterForm) {
        bookingFilterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_booking_filter_data();
        });
    }

    //Admin Login Form
    let adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_admin_login_data();
        });
    }

    //Admin Registration Form
    let AdminRegisterForm = document.getElementById("AdminRegisterForm");
    if (AdminRegisterForm) {
        AdminRegisterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            collect_admin_register_data();
        });
    }

});



//Add User Validation


function collect_user_data() {

    let validName = validateUserName();
    let validEmail = validateUserEmail();
    let validPhone = validateUserPhone();
    let validRole = validateUserRole();
    let validStatus = validateUserStatus();
    let validPassword = validateUserPassword();

    let msg = document.getElementById("msg");

    if (validName && validEmail && validPhone &&
        validRole && validStatus && validPassword) {

        msg.innerHTML = "User form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateUserName() {

    let name = document.getElementById("UserName").value;
    let Error = document.getElementById("UserNameError");

    if (name.trim() == "") {
        Error.innerHTML = "Please Enter The Name";
        return false;
    }
    else if (name.trim().length < 3) {
        Error.innerHTML = "Name must contain at least 3 characters";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateUserEmail() {

    let email = document.getElementById("UserEmail").value;
    let Error = document.getElementById("UserEmailError");

    if (email == "") {
        Error.innerHTML = "Please Enter The Email";
        return false;
    }
    else if (!email.includes("@") || !email.includes(".")) {
        Error.innerHTML = "Please Enter A Valid Email";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateUserPhone() {

    let phone = document.getElementById("UserPhone").value;
    let Error = document.getElementById("UserPhoneError");

    if (phone == "") {
        Error.innerHTML = "Please Enter The Phone Number";
        return false;
    }
    else if (!/^01[0-9]{9}$/.test(phone)) {
        Error.innerHTML = "Enter a valid 11-digit phone number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateUserRole() {

    let role = document.getElementById("UserRole").value;
    let Error = document.getElementById("UserRoleError");

    if (role == "") {
        Error.innerHTML = "Please Select A Role";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateUserStatus() {

    let status = document.querySelector('input[name="status"]:checked');
    let Error = document.getElementById("UserStatusError");

    if (status == null) {
        Error.innerHTML = "Please Select A Status";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateUserPassword() {

    let password = document.getElementById("UserPassword").value;
    let Error = document.getElementById("UserPasswordError");

    if (password == "") {
        Error.innerHTML = "Please Enter A Password";
        return false;
    }
    else if (password.length < 6 ||
             !/[A-Za-z]/.test(password) ||
             !/[0-9]/.test(password)) {
        Error.innerHTML = "Password must have at least 6 characters, a letter and a number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

//Edit User Validation

function collect_edit_user_data() {

    let validName = validateEditUserName();
    let validEmail = validateEditUserEmail();
    let validPhone = validateEditUserPhone();
    let validRole = validateEditUserRole();
    let validStatus = validateEditUserStatus();
    let validPassword = validateEditUserPassword();

    let msg = document.getElementById("msg");

    if (validName && validEmail && validPhone &&
        validRole && validStatus && validPassword) {

        msg.innerHTML = "Edit user form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateEditUserName() {

    let name = document.getElementById("EditUserName").value;
    let Error = document.getElementById("EditUserNameError");

    if (name.trim() == "") {
        Error.innerHTML = "Please Enter The Name";
        return false;
    }
    else if (name.trim().length < 3) {
        Error.innerHTML = "Name must contain at least 3 characters";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditUserEmail() {

    let email = document.getElementById("EditUserEmail").value;
    let Error = document.getElementById("EditUserEmailError");

    if (email == "") {
        Error.innerHTML = "Please Enter The Email";
        return false;
    }
    else if (!email.includes("@") || !email.includes(".")) {
        Error.innerHTML = "Please Enter A Valid Email";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditUserPhone() {

    let phone = document.getElementById("EditUserPhone").value;
    let Error = document.getElementById("EditUserPhoneError");

    if (phone == "") {
        Error.innerHTML = "Please Enter The Phone Number";
        return false;
    }
    else if (!/^01[0-9]{9}$/.test(phone)) {
        Error.innerHTML = "Enter a valid 11-digit phone number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditUserRole() {

    let role = document.getElementById("EditUserRole").value;
    let Error = document.getElementById("EditUserRoleError");

    if (role == "") {
        Error.innerHTML = "Please Select A Role";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditUserStatus() {

    let status = document.querySelector('input[name="editStatus"]:checked');
    let Error = document.getElementById("EditUserStatusError");

    if (status == null) {
        Error.innerHTML = "Please Select A Status";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditUserPassword() {

    let password = document.getElementById("EditUserPassword").value;
    let Error = document.getElementById("EditUserPasswordError");

    if (password == "") {
        Error.innerHTML = "";
        return true;
    }
    else if (password.length < 6 ||
             !/[A-Za-z]/.test(password) ||
             !/[0-9]/.test(password)) {
        Error.innerHTML = "Password must have at least 6 characters, a letter and a number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

// Add Branch Validation

function collect_branch_data() {

    let validName = validateBranchName();
    let validCity = validateBranchCity();

    let msg = document.getElementById("msg");

    if (validName && validCity) {
        msg.innerHTML = "Branch form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateBranchName() {

    let name = document.getElementById("BranchName").value;
    let Error = document.getElementById("BranchNameError");

    if (name.trim() == "") {
        Error.innerHTML = "Please Enter The Branch Name";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateBranchCity() {

    let city = document.getElementById("BranchCity").value;
    let Error = document.getElementById("BranchCityError");

    if (city.trim() == "") {
        Error.innerHTML = "Please Enter The City";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

// Edit Branch Validation

function collect_edit_branch_data() {

    let validName = validateEditBranchName();
    let validCity = validateEditBranchCity();

    let msg = document.getElementById("msg");

    if (validName && validCity) {
        msg.innerHTML = "Edit branch form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateEditBranchName() {

    let name = document.getElementById("EditBranchName").value;
    let Error = document.getElementById("EditBranchNameError");

    if (name.trim() == "") {
        Error.innerHTML = "Please Enter The Branch Name";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateEditBranchCity() {

    let city = document.getElementById("EditBranchCity").value;
    let Error = document.getElementById("EditBranchCityError");

    if (city.trim() == "") {
        Error.innerHTML = "Please Enter The City";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

// Booking Filter Validation

function collect_booking_filter_data() {

    let validDate = validateBookingDate();

    let msg = document.getElementById("msg");

    if (validDate) {
        msg.innerHTML = "Booking filter is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateBookingDate() {

    let from = document.getElementById("BookingFrom").value;
    let to = document.getElementById("BookingTo").value;
    let Error = document.getElementById("BookingDateError");

    if (from != "" && to != "" && from > to) {
        Error.innerHTML = "To date cannot be before the From date";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

// Admin Login Validation

function collect_admin_login_data() {

    let validEmail = validateAdmLoginEmail();
    let validPassword = validateAdmLoginPassword();

    let msg = document.getElementById("AdmLoginMsg");

    if (validEmail && validPassword) {
        msg.innerHTML = "Login form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateAdmLoginEmail() {

    let email = document.getElementById("AdmLoginEmail").value;
    let Error = document.getElementById("AdmLoginEmailError");

    if (email == "") {
        Error.innerHTML = "Please Enter Your Email";
        return false;
    }
    else if (!email.includes("@") || !email.includes(".")) {
        Error.innerHTML = "Please Enter A Valid Email";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmLoginPassword() {

    let password = document.getElementById("AdmLoginPassword").value;
    let Error = document.getElementById("AdmLoginPasswordError");

    if (password == "") {
        Error.innerHTML = "Please Enter Your Password";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

// Admin Registration Validation

function collect_admin_register_data() {

    let validName = validateAdmName();
    let validEmail = validateAdmEmail();
    let validPhone = validateAdmPhone();
    let validAge = validateAdmAge();
    let validGender = validateAdmGender();
    let validDepartment = validateAdmDepartment();
    let validPassword = validateAdmPassword();
    let validConfirm = validateAdmConfirm();
    let validTerms = validateAdmTerms();

    let msg = document.getElementById("msg");

    if (validName && validEmail && validPhone && validAge &&
        validGender && validDepartment && validPassword &&
        validConfirm && validTerms) {

        msg.innerHTML = "Admin registration form is correct";
        msg.style.color = "green";
        return true;
    }
    else {
        msg.innerHTML = "Please fix the errors above";
        msg.style.color = "red";
        return false;
    }
}

function validateAdmName() {

    let name = document.getElementById("AdmName").value;
    let Error = document.getElementById("AdmNameError");

    if (name.trim() == "") {
        Error.innerHTML = "Please Enter The Name";
        return false;
    }
    else if (name.trim().length < 3) {
        Error.innerHTML = "Name must contain at least 3 characters";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmEmail() {

    let email = document.getElementById("AdmEmail").value;
    let Error = document.getElementById("AdmEmailError");

    if (email == "") {
        Error.innerHTML = "Please Enter The Email";
        return false;
    }
    else if (!email.includes("@") || !email.includes(".")) {
        Error.innerHTML = "Please Enter A Valid Email";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmPhone() {

    let phone = document.getElementById("AdmPhone").value;
    let Error = document.getElementById("AdmPhoneError");

    if (phone == "") {
        Error.innerHTML = "Please Enter The Phone Number";
        return false;
    }
    else if (!/^01[0-9]{9}$/.test(phone)) {
        Error.innerHTML = "Enter a valid 11-digit phone number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmAge() {

    let age = document.getElementById("AdmAge").value;
    let Error = document.getElementById("AdmAgeError");

    if (age == "") {
        Error.innerHTML = "Please Enter The Age";
        return false;
    }
    else if (age < 18) {
        Error.innerHTML = "Admin must be at least 18 years old";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmGender() {

    let gender = document.querySelector('input[name="admGender"]:checked');
    let Error = document.getElementById("AdmGenderError");

    if (gender == null) {
        Error.innerHTML = "Please Select A Gender";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmDepartment() {

    let department = document.getElementById("AdmDepartment").value;
    let Error = document.getElementById("AdmDepartmentError");

    if (department == "") {
        Error.innerHTML = "Please Select A Department";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmPassword() {

    let password = document.getElementById("AdmPassword").value;
    let Error = document.getElementById("AdmPasswordError");

    if (password == "") {
        Error.innerHTML = "Please Enter A Password";
        return false;
    }
    else if (password.length < 6 ||
             !/[A-Za-z]/.test(password) ||
             !/[0-9]/.test(password)) {
        Error.innerHTML = "Password must have at least 6 characters, a letter and a number";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmConfirm() {

    let password = document.getElementById("AdmPassword").value;
    let confirm = document.getElementById("AdmConfirm").value;
    let Error = document.getElementById("AdmConfirmError");

    if (confirm == "") {
        Error.innerHTML = "Please Confirm The Password";
        return false;
    }
    else if (confirm != password) {
        Error.innerHTML = "Passwords do not match";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}

function validateAdmTerms() {

    let terms = document.getElementById("AdmTerms").checked;
    let Error = document.getElementById("AdmTermsError");

    if (terms == false) {
        Error.innerHTML = "Please Confirm The Admin Permission";
        return false;
    }
    else {
        Error.innerHTML = "";
        return true;
    }
}
