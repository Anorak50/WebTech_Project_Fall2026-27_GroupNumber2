
function collect_data(){
    let validName=validateName();
    let validEmail=validateEmail();
    let validPhone=validatePhone();
    let validGender=validateGender();
    let validAddress=validateAddress();
    let validUsername=validateUsername();
    let validPassword=validatePassword();

    return validName && validEmail && validPhone && validGender && validAddress && validUsername && validPassword;
}

function validateName(){
    let name=document.getElementById("customerName").value.trim();
    let Error=document.getElementById("NameError");

    if(name==""){
        Error.innerHTML="Enter Your Name";
        return false;
    }
    else if(name.length<6){
        Error.innerHTML="Name Must Be At Least 6 Characters";
        return false;
    }
    else{
        Error.innerHTML=""+name;
        return true;
    }
}

function validateEmail(){
    let email=document.getElementById("email").value.trim();
    let Error=document.getElementById("EmailError");
    let regexpression=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email==""){
        Error.innerHTML="Please Enter Your Email";
        return false;
    }
    else if(!regexpression.test(email)){
        Error.innerHTML="Enter A Valid Email";
        return false;
    }
    else{
        Error.innerHTML="";
        return true;
    }
}

function validatePhone(){
    let phone=document.getElementById("phone").value.trim();
    let Error=document.getElementById("PhoneError");

    if(phone==""){
        Error.innerHTML="Enter Your Phone Number";
        return false;
    }
    else if(phone.length!=11){
        Error.innerHTML="Phone Number Must Be 11 Digits";
        return false;
    }
    else{
        Error.innerHTML="";
        return true;
    }
}

function validateGender(){
    let genders=document.querySelectorAll('input[name="gender"]');
    let GenderError=document.getElementById("ErrorGender");
    let selectGender="";

    for(let i=0;i<genders.length;i++){
        if(genders[i].checked){
            selectGender=genders[i].value;
            break;
        }
    }

    if(selectGender==""){
        GenderError.innerHTML="Please Select Your Gender";
        return false;
    }
    else{
        GenderError.innerHTML="";
        return true;
    }
}

function validateAddress(){
    let address=document.getElementById("address").value.trim();
    let Error=document.getElementById("AddressError");

    if(address==""){
        Error.innerHTML="Please Enter Your Address";
        return false;
    }
    else{
        Error.innerHTML="";
        return true;
    }
}

function validateUsername(){
    let username=document.getElementById("username").value.trim();
    let Error=document.getElementById("UsernameError");

    if(username==""){
        Error.innerHTML="Please Enter Your Username";
        return false;
    }
    else if(username.length<4){
        Error.innerHTML="Username Must Be At Least 4 Characters";
        return false;
    }
    else{
        Error.innerHTML="";
        return true;
    }
}

function validatePassword(){
    let password=document.getElementById("password").value;
    let confirmPassword=document.getElementById("confirmPassword").value;
    let PasswordError=document.getElementById("PasswordError");
    let ConfirmPasswordError=document.getElementById("ConfirmPasswordError");

    if(password==""){
        PasswordError.innerHTML="Please Enter Your Password";
        return false;
    }
    else if(password.length<6){
        PasswordError.innerHTML="Password Must Be At Least 6 Characters";
        return false;
    }
    else{
        PasswordError.innerHTML="";
    }

    if(confirmPassword==""){
        ConfirmPasswordError.innerHTML="Please Confirm Your Password";
        return false;
    }
    else if(password!=confirmPassword){
        ConfirmPasswordError.innerHTML="Passwords Do Not Match";
        return false;
    }
    else{
        ConfirmPasswordError.innerHTML="";
        return true;
    }
}
