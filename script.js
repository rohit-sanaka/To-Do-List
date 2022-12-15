const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const clearAll = document.querySelector(".clear-btn");
const filters = document.querySelectorAll(".filters span");

let edidId;
let isEditedTask = false;
// Getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
                                <p class="${isCompleted}">${todo.name}</p>
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
showTodo("all");

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

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}
clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});
function editTask(taskId, taskName) {
    taskInput.value = taskName;
    edidId = taskId;
    isEditedTask = true;
}
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

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            taskInput.value = ""; //resetting value of input field.
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); //adding new task to todos
        } else {
            isEditedTask = false;
            todos[edidId].name = userTask;
        }
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});
