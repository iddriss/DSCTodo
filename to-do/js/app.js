//Global variables

let user = { name: "your name" };
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

//2 addTodb function

//3 read from db function
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
//4 addTodb
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

 //5         addTodb(user.name, { todo: todoItems })
 //6         addTodb(user.name, { done: doneItems })
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







