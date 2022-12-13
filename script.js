const taskInput = document.querySelector(".task-input input");

// Getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

function showTodo() {
    todos.forEach((element, id) => {
        console.log(id, element);
    });
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
        showTodo();
    }
});
