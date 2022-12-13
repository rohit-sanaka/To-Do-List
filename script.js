const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");

// Getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

function addTodo() {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            li += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" />
                            <p>${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li><i class="uil uil-pen">Edit</i></li>
                                <li><i class="uil uil-trash">Delete</i></li>
                            </ul>
                        </div>
                    </li>`;
        });
        taskBox.innerHTML = li;
    }
}

function updateStatus(selectedTask) {
    // to get the task name of the selected task
    let taskName = selectedTask.parentElement.lastElementChild;
    console.log(taskName);
    if (selectedTask.checked) {
        taskName.classList.add("checked");
    } else {
        taskName.classList.remove("checked");
    }
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!todos) {
            todos = [];
        }
        taskInput.value = ""; //resetting value of input field.

        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo); //adding new task to todos
        localStorage.setItem("todo-list", JSON.stringify(todos));
        addTodo();
    }
});
