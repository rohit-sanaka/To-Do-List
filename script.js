const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const clearAll = document.querySelector(".clear-btn");
const filters = document.querySelectorAll(".filters span");
const submit = document.querySelector(".submit-btn");

let editId;
let currentFilter = "all";
let isEditedTask = false;

// Getting localstorage todo-list (to-do list is a object{dict})
let todos = JSON.parse(localStorage.getItem("todo-list"));

//Main function to pass the html of tasks from based on local storage data.
function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
                                <span class="${isCompleted}">${todo.name}</span>
                            </label>
                            <div class="settings">
                                <i onclick = "showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li><i onclick = "editTask(${id}, '${todo.name}')" class="uil uil-pen">Edit</i></li>
                                    <li><i onclick = "deleteTask(${id})" class="uil uil-trash">Delete</i></li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
        taskBox.innerHTML =
            li || "<span>You don't have any task here...</span>";
    }
}
//On load show all taks.
showTodo("all");

//checking for filter option (all / pending / completed)
filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        filter.classList.add("active");
        currentFilter = filter.id;
        showTodo(currentFilter);
    });
});

//to display day, date, clock
function updateClock() {
    const days = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
    };
    var currentTime = new Date();
    var currentDay = days[currentTime.getUTCDay()];
    document.getElementById("day").firstChild.nodeValue = currentDay;

    var currentDate = currentTime.getDate();
    var currentMonth = currentTime.getMonth();
    var currentYear = currentTime.getFullYear();
    var currentDateString =
        currentDate + "/" + currentMonth + "/" + currentYear;
    document.getElementById("date").firstChild.nodeValue = currentDateString;
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();
    var timeOfDay = currentHours < 12 ? "AM" : "PM";
    currentHours = currentHours > 12 ? currentHours - 12 : currentHours;
    currentHours = (currentHours < 10 ? "0" : "") + currentHours;
    currentHours = currentHours == 0 ? 12 : currentHours;
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
    var currentTimeString =
        currentHours +
        ":" +
        currentMinutes +
        ":" +
        currentSeconds +
        " " +
        timeOfDay;
    document.getElementById("clock").firstChild.nodeValue = currentTimeString;
}
//updating time for every 100ms.
setInterval(updateClock, 100);

//To show option menu for a task when click on three dots.
function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    if (!taskMenu.classList.contains("show")) {
        taskMenu.classList.add("show");
    } else {
        taskMenu.classList.remove("show");
    }
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

//to edit a task
function editTask(taskId, taskName) {
    taskInput.value = taskName;
    editId = taskId;
    isEditedTask = true;
}

// to delete a task
function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
}

//to clear all task from local storage.
clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
});

//to update the status of the task (completed/pending)
function updateStatus(selectedTask) {
    // to get the task name of the selected task
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

//Main function to add a task to the task-list on pressing "Enter" key or submit button
function addTask(e) {
    let userTask = taskInput.value.trim();
    if ((e.key == "Enter" || e.target.tagName == "BUTTON") && userTask) {
        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            taskInput.value = ""; //resetting value of input field.
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); //adding new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
            taskInput.value = ""; //resetting value of input field.
        }
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(currentFilter);
    }
}
//add task on "Enter Key"
taskInput.addEventListener("keyup", addTask);
//add task on "Submit" Button.
submit.addEventListener("click", addTask);
