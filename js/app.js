//Global variables

let user = { name: "iddriss" };
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

var config = {
    apiKey: "AIzaSyDU--lM2nA3JIHj6VHz4Kp8klRksISPMmk",
    authDomain: "dsctodo.firebaseapp.com",
    databaseURL: "https://dsctodo.firebaseio.com",
    projectId: "dsctodo",
    storageBucket: "dsctodo.appspot.com",
    messagingSenderId: "292991377466"
};
firebase.initializeApp(config);

function addTodb(location, data) {
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(location)

    userRef.set(data, { merge: true })
        .then(() => console.log("Done"))
        .catch(err => console.log(err))
}

function readFromdb(location) {
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(location)

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

window.onload = readFromdb(user.name)

//events
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let input = form.querySelector("input");
    if (!input.value) {
        input.required = true;
    } else {
        todoItems.unshift({ "text": input.value, "done": false, "time": Date.now() })
        data = { todo: todoItems }
        addTodb(user.name, data);
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

            addTodb(user.name, { todo: todoItems })
            addTodb(user.name, { done: doneItems })
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

            addTodb(user.name, { todo: todoItems })
            addTodb(user.name, { done: doneItems })
        })

        li.appendChild(p);
        li.appendChild(input);
        li.appendChild(del);

        elRef.append(li)
    }


}







