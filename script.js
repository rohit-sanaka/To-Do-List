const filterLinks = [...document.querySelectorAll(".controls span")];
const light = document.querySelector(".controls .tubelight");
let activeIndex = 0;
let currentIndex = 0;
let increment = 1;

/* The above code is a simple filter that changes the active class on the filter links. */

filterLinks.forEach((link, index) => {
  /* Setting the position of the light to the active filter. */
  if (filterLinks[index].classList.contains("active")) {
    light.style.left = `${filterLinks[index].offsetLeft}px`;
  }
  /* This is a function that is called when the user clicks on a filter link. It will set the
  activeIndex to the index of the filter link that was clicked. It will then set an interval that
  will increment the currentIndex until it reaches the activeIndex. It will then add the active
  class to the filter link at the currentIndex and remove the active class from the previous filter
  link. It will then set the increment to 0 and clear the interval. It will then set the left
  position of the light to the offsetLeft of the filter link that was clicked. */
  link.addEventListener("click", (e) => {
    activeIndex = index;
    let t = setInterval(() => {
      if (activeIndex > currentIndex) increment = 1;
      else if (activeIndex < currentIndex) increment = -1;
      currentIndex += increment;

      filterLinks[currentIndex].classList.add("active");
      if (currentIndex != -1)
        filterLinks[currentIndex - increment].classList.remove("active");

      if (currentIndex == activeIndex) {
        e.target.classList.add("active");
        increment = 0;
        clearInterval(t);
      }
    }, 50);
    light.style.left = `${e.target.offsetLeft}px`;
  });
});

const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const clearBtn = document.querySelector(".clear-btn");
const broomBtn = document.querySelector(".broom-btn");
const filters = document.querySelectorAll(".filters span");
const submit = document.querySelector(".submit-btn");
const plusButton = document.querySelector(".plus-btn");

let editId;
let currentFilter = "all";
let isEditedTask = false;

/* This is a line of code that is getting the todo-list from local storage and parsing it into a
JavaScript object. */
let todos = JSON.parse(localStorage.getItem("todo-list"));

/**
 * It takes a filter as an argument and loops through the todos array, if the filter matches the status
 * of the todo, it will add the todo to the list.
 * @param filter - the filter that is passed to the function
 */
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
                        <i onclick = "editTask(${id}, '${todo.name}')" class="uil uil-pen"></i>
                        <i onclick = "deleteTask(${id})" class="uil uil-trash"></i>
                    </div>
                </li>`;
      }
    });
    taskBox.innerHTML = li || "<span>You don't have any task here...</span>";
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
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  var currentTime = new Date();
  var currentDay = days[currentTime.getUTCDay()];
  document.getElementById("day").firstChild.nodeValue = currentDay;

  var currentDate = currentTime.getDate();
  var currentMonth = currentTime.getMonth();
  var currentYear = currentTime.getFullYear();
  var currentDateString = currentDate + "/" + currentMonth + "/" + currentYear;
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
function clearAll() {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(currentFilter);
}
clearBtn.addEventListener("click", clearAll);
broomBtn.addEventListener("click", clearAll);

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
/**
 * If the user presses the enter key, or clicks the add button, or clicks the add icon, and the user has
 * entered a task, then add the task to the todo list.
 * @param e - the event object
 */
function addTask(e) {
  let userTask = taskInput.value.trim();
  if (
    (e.key == "Enter" ||
      e.target.tagName == "BUTTON" ||
      e.target.tagName == "I") &&
    userTask
  ) {
    /* This is a conditional statement that is checking if the user is editing a task. If the user is
    editing a task, then it will set the name of the task to the user's input. If the user is not
    editing a task, then it will add the task to the todo list. */
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

//add task on "Submit/Plus" Button.
submit.addEventListener("click", addTask);
plusButton.addEventListener("click", addTask);
