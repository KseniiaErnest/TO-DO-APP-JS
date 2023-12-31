'use strict'
const task = document.querySelector('#newTask');
const listTasks = document.querySelector('ul');

// A variable to track changes in current task
let currentTask = null;

// On app load get all tasks from local storage
window.onload = loadTasks;

// Submit task on submit
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(task, listTasks);
});

// Function to add new task
function addTask(task, listTasks) {

  // Check if input empty
  if (task.value === '') {
    Swal.fire({
      title: 'Please, add some task',
      color: '#2d2119',
      background: '#FFF2CC',
      confirmButtonColor: '#2d2119' ,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
    return false;
  };

  // Check if task already exists in localStorage
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')) || []) ;

  tasks.forEach(oneTask => {
    if (oneTask === task.value) {
      Swal.fire({
        title: 'Task already exists',
        color: '#2d2119',
        background: '#FFF2CC',
        confirmButtonColor: '#2d2119' ,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      task.value = '';
      return;
    }
  });

  // Add task to local storage
 tasks.push({ task: task.value, completed: false});
 localStorage.setItem('tasks', JSON.stringify(tasks));

  // Creating and displaying task - create li, add innerHTML, append to ul
  const li = document.createElement('li');
  li.innerHTML = ` <input type="checkbox" onclick="taskComplete(this)" class="check">
  <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
  <img src="icons8-trash-50.png" class="img-trash" onclick="deleteTask(this)"></img> `;
  listTasks.appendChild(li);
  task.value = '';
}

// Function to load the tasks from the localStorage
function loadTasks() {
  // Get the tasks from local storage and convert them to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')) || []);

  // Loop through an array of tasks and add them to the list
  tasks.forEach(taskOne => {
    const li = document.createElement('li');

    li.innerHTML = ` <input type="checkbox" onclick="taskComplete(this)" class="check" ${taskOne.completed ? 'checked' : ''}>
    <input type="text" value="${taskOne.task}" class="task ${taskOne.completed ? 'checked' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
    <img src="icons8-trash-50.png" class="img-trash" onclick="deleteTask(this)"></img> `;

    listTasks.appendChild(li);
  });
};

// Function to get curent task
function getCurrentTask(event) {
  currentTask = event.value;
};

// Function to edit the current task and update the local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));

  // checking if task left empty
  if (event.value === '') {
    Swal.fire({
      title: 'Task is empty!',
      color: '#2d2119',
      background: '#FFF2CC',
      confirmButtonColor: '#2d2119' ,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
    event.value = currentTask;
    return;
  };

  // check if the task already exist (duplicate)
  tasks.forEach(t => {
    if (t.task === event.value) {
      Swal.fire({
        title: 'Task already exists',
        color: '#2d2119',
        background: '#FFF2CC',
        confirmButtonColor: '#2d2119' ,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      event.value = currentTask;
      return;
    }
  });

  // Update task
  tasks.forEach(taskToUpdate => {
    if (taskToUpdate.task === currentTask) {
      taskToUpdate.task = event.value;
    }
  });

  // Update local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Mark the complete task
function taskComplete(event) {
  // Get the tasks from local storage and convert them to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // Loop through the tasks array
  tasks.forEach(task => {
    // Compare the task description with the value of the next element sibling of the clicked checkbox
    if (task.task === event.nextElementSibling.value) {
      // Toggle the completed status of the task
      task.completed = !task.completed;
    }
  });

  // Update the tasks array in local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Toggle the "completed" class on the next element sibling (the input field) of the clicked checkbox
  event.nextElementSibling.classList.toggle("task--completed");
}

// Delete task
function deleteTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  tasks.forEach(t => {
    if (t.task === event.parentNode.children[1].value) {
      tasks.splice(tasks.indexOf(t), 1);
    }
  });

  // Update the tasks array in local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Remove the parent element of the clicked element (the task's <li> element)
  event.parentElement.remove();
}