// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBHvuCxNIZ525B2fPIgTE23Z9A51YMZtlw",
    authDomain: "first-project-59564.firebaseapp.com",
    databaseURL: "https://first-project-59564-default-rtdb.firebaseio.com",
    projectId: "first-project-59564",
    storageBucket: "first-project-59564.appspot.com",
    messagingSenderId: "947027265089",
    appId: "1:947027265089:web:ab51a4f823f6ff2ade28c0",
    measurementId: "G-G536LP4MYR"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

var path = location.pathname

// index page variables

var userFName = document.getElementById("signUpFName")
var userLName = document.getElementById("signUpLName")
var signUpEmail = document.getElementById("signUpEmail")
var signUpPassword = document.getElementById("signUpPass")
var conPassword = document.getElementById("signUpConPass")
var signUpBtn = document.getElementById("signUpBtn")
// var signUpGmail = document.getElementById("signUpGmail")
// var signUpFb = document.getElementById("signUpFb")
var signInEmail = document.getElementById("signInEmail")
var signInPassword = document.getElementById("signInPass")
var forgotPass = document.getElementById("forgotPass")
var signInBtn = document.getElementById("signInBtn")
// var signInGmail = document.getElementById("signInGmail")
// var signInFb = document.getElementById("signInFb")
var goToSignUp = document.getElementById("goToSignUp")
var goToSignIn = document.getElementById("goToSignIn")
var hideBtns = document.querySelectorAll(".hide")
var loader = document.getElementById("loading")

// index page event listeners

signUpBtn.addEventListener("click", signUp)
signInBtn.addEventListener("click", signIn)
hideBtns.forEach((elemBtn) => { elemBtn.addEventListener("click", () => { showPass(elemBtn) }) })
goToSignIn.addEventListener("click", () => { signUpsignIn(goToSignIn) })
goToSignUp.addEventListener("click", () => { signUpsignIn(goToSignUp) })


// User state change 
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;

        let goTo = window.location.href
        if (!goTo.includes("todo.html")) {
            setTimeout(() => {
                loader.classList.replace("d-block", "d-none")
                window.location = goTo + "todo.html"
            }, 3000);
        }

    } else {
        // User is signed out
    }
});

// Index page Func

// Register new users

function signUp() {
    let passCheck = document.querySelector("#passCheck")
    passCheck.classList.replace("d-block", "d-none")

    let valid = false
    switch (valid) {
        case userFName.checkValidity():
            userFName.reportValidity()
            break
        case userLName.checkValidity():
            userLName.reportValidity()
            break
        case signUpEmail.checkValidity():
            signUpEmail.reportValidity()
            break
        case signUpPassword.checkValidity():
            signUpPassword.reportValidity()
            break
        case conPassword.checkValidity():
            conPassword.reportValidity()
            break
        default:
            valid = true
    }

    let email = signUpEmail.value, password = signUpPassword.value, conPass = conPassword.value, fName = userFName.value, lname = userLName.value;

    if (!valid) {
        return null
    } else if (password.length < 8) {
        passCheck.classList.replace("d-none", "d-block")
        passCheck.textContent = "Password should be min. 8 characters long"
    } else if (password === conPass) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                loader.classList.replace("d-none", "d-block")
                // Signed in 
                const user = userCredential.user;
                let uid = user.uid;

                set(ref(database, 'appData/userInfo/' + uid), {
                    address: `not set`,
                    email: email,
                    fName: fName,
                    lName: lname,
                    password: password,
                    phone: `not set`
                });
            })
            .catch((error) => {
                passCheck.classList.replace("d-none", "d-block")
                passCheck.textContent = "This email is used by another account"
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("sign up error-->", errorMessage);

            });

    } else {
        passCheck.textContent = "Passwords do not match"
        passCheck.classList.replace("d-none", "d-block")
    }
}

// Allow login for existing users

function signIn() {
    let accCheck = document.querySelector("#accountCheck")
    accCheck.classList.replace("d-block", "d-none")

    let valid = false
    switch (valid) {
        case signInEmail.checkValidity():
            signInEmail.reportValidity()
            break
        case signInPassword.checkValidity():
            signInPassword.reportValidity()
            break
        default:
            valid = true
    }
    let email = signInEmail.value, password = signInPassword.value

    if (!valid) {
        return null
    }
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loader.classList.replace("d-none", "d-block")
            // Signed in 
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("sign in error-->", errorMessage);

            accCheck.classList.replace("d-none", "d-block")
        });
}

// Show and hide password toggler

function showPass(elem) {
    let pass = elem.parentNode.children
    for (const i of pass) {
        if (i.localName == "input") {
            if (i.type == "password") {
                i.type = "text"
                elem.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'
            }
            else {
                i.type = "password"
                elem.innerHTML = '<i class="fa-solid fa-eye"></i>'
            }
        }
    }
}

// Sign up and Sign in page navigator

function signUpsignIn(elem) {
    let signUp = document.querySelector("#signUp")
    let signIn = document.querySelector("#signIn")
    if (elem.id == "goToSignUp") {
        signInEmail.value = null, signInPassword.value = null
        signIn.classList.add("moveOut")
        setTimeout(() => {
            signIn.classList.replace("d-flex", "d-none")
            signUp.classList.replace("d-none", "d-flex")
            setTimeout(() => {
                signUp.classList.remove("moveIn")
            }, 50);
        }, 1310)
    } else {
        userFName.value = null, userLName.value = null, signUpEmail.value = null, signUpPassword.value = null, conPassword.value = null
        let passCheck = document.querySelector("#passCheck")
        passCheck.classList.replace("d-block", "d-none")
        signUp.classList.add("moveIn")
        setTimeout(() => {
            signIn.classList.replace("d-none", "d-flex")
            signUp.classList.replace("d-flex", "d-none")
            setTimeout(() => {
                signIn.classList.remove("moveOut")
            }, 50);
        }, 1310);
    }
}

