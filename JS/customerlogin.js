function collect_data(){
    let validUsername = validateUsername();
    let validPassword = validatePassword();

    return validUsername && validPassword;
}

function validateUsername(){
    let username = document.getElementById("username").value;
    let error = document.getElementById("UsernameError");

    if(username == ""){
        error.innerHTML = "Username cannot be empty";
        return false;
    }
    else{
        error.innerHTML = "";
        return true;
    }
}

function validatePassword(){
    let password = document.getElementById("password").value;
    let error = document.getElementById("PasswordError");

    if(password == ""){
        error.innerHTML = "Password cannot be empty";
        return false;
    }
    else{
        error.innerHTML = "";
        return true;
    }
}

