//Global variables
let sessionUser;
let todoItems = []
let doneItems = []
let form = document.querySelector(".form");
let todo = document.querySelector(".todo");
let todoList = todo.querySelector("#pending");

let done = document.querySelector(".done");
let doneList = done.querySelector("#fin");

let pending = document.querySelector(".pending");
let completed = document.querySelector(".completed");


//######################## Firebase code #################
//1 Config
var config = {
    apiKey: "AIzaSyA3apKypCgfMx1uSh9KR_NUBfzL1SJjNvA",
    authDomain: "dsc-to-do-with-auth.firebaseapp.com",
    databaseURL: "https://dsc-to-do-with-auth.firebaseio.com",
    projectId: "dsc-to-do-with-auth",
    storageBucket: "dsc-to-do-with-auth.appspot.com",
    messagingSenderId: "435624003702"
};
firebase.initializeApp(config);

//2 account status
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            sessionUser = user;
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function (accessToken) {
                document.getElementById('sign-in-status').textContent = 'Signed in';
                document.getElementById('sign-in').textContent = 'Sign out';
                document.getElementById('account-details').textContent = JSON.stringify({
                    displayName: displayName,
                    email: email,
                    emailVerified: emailVerified,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    uid: uid,
                    accessToken: accessToken,
                    providerData: providerData
                }, null, '  ');
            });
        } else {
            // User is signed out.
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
        }
    }, function (error) {
        console.log(error);
    });
};

//2 addTodb function
function addTodb(location, data) {
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(sessionUser)

    userRef.set(data, { merge: true })
        .then(() => console.log("Done"))
        .catch(err => console.log(err))
}

//3 read from db function
function readFromdb(location) {
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(sessionUser.uid)

    userRef.onSnapshot(snap => {
        //console.log(snap.data())
        data = snap.data()
        updateUI(data.todo, todoList, "todo")
        updateUI(data.done, doneList, "done")
        todoItems = data.todo
        doneItems = data.done
    }, err => console.log(err));
}
//####################### End of Firebase code ##################


window.addEventListener('load', function () {
    initApp()
    if(sessionUser) {
        readFromdb(sessionUser.ui)
    }
});

//events
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let input = form.querySelector("input");
    if (!input.value) {
        input.required = true;
    } else {
        todoItems.unshift({ "text": input.value, "done": false, "time": Date.now() })
        data = { todo: todoItems }
        addTodb(data)
    }
})

pending.addEventListener("click", (e) => {
    e.target.classList.add("active");
    todo.classList.remove("hidden");
    completed.classList.remove("active");
    done.classList.add("hidden");
})

completed.addEventListener("click", (e) => {
    e.target.classList.add("active");
    done.classList.remove("hidden");
    pending.classList.remove("active");
    todo.classList.add("hidden");
})


//function
function updateUI(arr, elRef, task) {
    while (elRef.firstChild) {
        elRef.removeChild(elRef.firstChild);
    }
    for (let [i, data] of arr.entries()) {

        let li = document.createElement("li");
        li.setAttribute("data-id", i);

        let p = document.createElement("p")
        p.textContent = data.text;

        let input = document.createElement("input")
        input.type = "checkbox";
        input.checked = data.done;
        input.className = "finished";

        input.addEventListener("change", (e) => {
            if (task == "todo") {
                doneItems.unshift({ ...todoItems[i], done: true })
                todoItems.splice(i, 1)
            } else {
                todoItems.unshift({ ...doneItems[i], done: false })
                doneItems.splice(i, 1)
            }

            addTodb({ todo: todoItems })
            addTodb({ done: doneItems })
        })

        let del = document.createElement("button");
        del.textContent = "Delete"
        del.className = "del";

        del.addEventListener("click", (e) => {
            if (task == "todo") {
                todoItems.splice(i, 1)
            } else {
                doneItems.splice(i, 1)
            }

            addTodb({ todo: todoItems })
            addTodb({ done: doneItems })
        })

        li.appendChild(p);
        li.appendChild(input);
        li.appendChild(del);

        elRef.append(li)
    }


}







