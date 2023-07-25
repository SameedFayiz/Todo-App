import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
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
        let loc = window.location.href
        window.location = loc.slice(0, loc.indexOf("todo.html"))
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
    setTimeout(() => {
        displayTodos()
    }, 1000);
}

async function displayTodos() {
    const querySnapshot = await getDocs(collection(db, localStorage.getItem("uid")));
    taskDisplay.innerHTML = null
    querySnapshot.forEach((doc) => {
        let time = doc.data().time.seconds
        time = new Date(time)
        let todo = `<div class="border-bottom row d-flex align-items-center py-2 px-3" id="${doc.id}">
                    <div class="my-0 col-9 p-2">${doc.data().todo}</div>
                    <div class="my-0 col-2 p-2">${time.toDateString() + " Time:" + time.toLocaleTimeString()}</div>
                    <div class="col-1 justify-content-center"><button type="button" class="btn-close bg-danger p-2 remTask" aria-label="Close"></button></div>
                </div>`
        taskDisplay.innerHTML += todo
    })
    let closeBtns = document.getElementsByClassName("remTask")
    Array.from(closeBtns).forEach((ele) => {
        ele.addEventListener("click", () => {
            removeTask(ele)
        })
    })
}

setTimeout(() => {
    displayTodos()
}, 3000);


async function removeTask(self) {
    self = self.parentNode.parentNode
    let removeID = self.id
    self.remove()
    await deleteDoc(doc(db, localStorage.getItem("uid"), removeID));
    setTimeout(() => {
        displayTodos()
    }, 1000);
}