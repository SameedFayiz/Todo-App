import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();


var task = document.getElementById("inTask")
var addBtn = document.getElementById("addTask")
var signOutAcc = document.getElementById("signOut")
var taskDisplay = document.getElementById("tasksDisplay")
addBtn.addEventListener("click", addTodos)
signOutAcc.addEventListener("click", userSignOut)


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        localStorage.setItem("uid", uid)
        // ...
    } else {
        // User is signed out
        // ...
    }
});

function userSignOut() {
    signOut(auth).then(() => {
        localStorage.removeItem("uid")
        let loc = window.location.href
        window.location = loc.slice(0, loc.indexOf("todo.html"))
        // Sign-out successful.
    }).catch((error) => {
        console.log("logout error-->", error.message);
        // An error happened.
    });
}

async function addTodos() {
    let userID = localStorage.getItem("uid");
    try {
        if (!task.value) {
            throw "Task field is empty"
        }
        let dateTime = new Date()
        const docRef = await addDoc(collection(db, userID), {
            time: dateTime,
            todo: task.value
        });
        task.value = null
    } catch (e) {
        alert(e);
    }
}

async function displayTodos() {
    taskDisplay.innerHTML = null
    const querySnapshot = await getDocs(collection(db, localStorage.getItem("uid")));
    querySnapshot.forEach((doc) => {
        let todo = `<div>${doc.data().todo}</div>`
        taskDisplay.innerHTML += todo
    })
}
setTimeout(() => {
    displayTodos()
}, 3000);