//addToDb
function addTodb(location, data) {
    let db = firebase.firestore();
    let userRef = db.collection("users").doc(location)

    userRef.set(data, { merge: true })
        .then(() => console.log("Done"))
        .catch(err => console.log(err))
} 

//readfromDb
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
