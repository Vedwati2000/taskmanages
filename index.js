
import { generateContent } from "./gemeniai";

async function useAI(content) {
    const prompt = `Provide me discription and priority for the below task:\n\n${content}`;
    const response = await generateContent(prompt);
    console.log(response);
    return response;
}

useAI();



const addTaskBtn = document.getElementById("addTaskBtn");
const editTaskBtn = document.getElementById("editTaskBtn");
const completeTaskBtn = document.getElementById("completeTaskBtn");
const remainTaskBtn = document.getElementById("remainTaskBtn");
const taskPage = document.getElementById("taskPage");

let tasks = [];
let completedTasks = [];

function renderAddTaskPage() {
  taskPage.innerHTML = `
        <h3>Add Task</h3>
        <form id="addTaskForm">
            <div class="mb-3">
                <label for="taskTitle" class="form-label">Task Title</label>
                <input type="text" id="taskTitle" class="form-control" placeholder="Enter task title" required>
            </div>
            <div class="mb-3">
                <label for="taskDesc" class="form-label">Task Description</label>
                <textarea id="taskDesc" class="form-control" placeholder="Enter task description"></textarea>
            </div>
            <div class="mb-3">
                <label for="taskDate" class="form-label">Task Date</label>
                <input type="date" id="taskDate" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
    `;

  document.getElementById("addTaskForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const desc = await useAI(title);
    const date = document.getElementById("taskDate").value;


    tasks.push({ id: Date.now(), title, desc, date, completed: false });
    alert("Task added successfully!");
    taskPage.innerHTML = "";
  });
}

function renderEditTaskPage() {
  if (tasks.length === 0) {
    alert("No tasks available to edit!");
    return;
  }

  let taskOptions = tasks
    .map((task) => `<option value="${task.id}">${task.title}</option>`)
    .join("");
  taskPage.innerHTML = `
        <h3>Edit Task</h3>
        <div class="mb-3">
            <label for="taskSelect" class="form-label">Select Task</label>
            <select id="taskSelect" class="form-select">${taskOptions}</select>
        </div>
        <div class="mb-3">
            <label for="newTaskDesc" class="form-label">New Description</label>
            <textarea id="newTaskDesc" class="form-control" placeholder="Update description"></textarea>
        </div>
        <div class="mb-3">
            <label for="newTaskDate" class="form-label">New Date</label>
            <input type="date" id="newTaskDate" class="form-control">
        </div>
        <button class="btn btn-warning" id="saveEditBtn">Save Changes</button>
    `;

  document.getElementById("saveEditBtn").addEventListener("click", () => {
    const taskId = document.getElementById("taskSelect").value;
    const newDesc = document.getElementById("newTaskDesc").value;
    const newDate = document.getElementById("newTaskDate").value;

    const task = tasks.find((task) => task.id == taskId);
    if (newDesc) task.desc = newDesc;
    if (newDate) task.date = newDate;

    alert("Task updated successfully!");
    taskPage.innerHTML = "";
  });
}

function renderCompleteTaskPage() {
  if (tasks.length === 0) {
    alert("No tasks available!");
    return;
  }

  let taskOptions = tasks
    .filter((task) => !task.completed)
    .map((task) => `<option value="${task.id}">${task.title}</option>`)
    .join("");

  taskPage.innerHTML = `
        <h3>Complete Task</h3>
        <div class="mb-3">
            <label for="completeTaskSelect" class="form-label">Select Task to Complete</label>
            <select id="completeTaskSelect" class="form-select">${taskOptions}</select>
        </div>
        <button class="btn btn-success" id="markCompleteBtn">Mark as Complete</button>
    `;

  document.getElementById("markCompleteBtn").addEventListener("click", () => {
    const taskId = document.getElementById("completeTaskSelect").value;
    const task = tasks.find((task) => task.id == taskId);
    task.completed = true;
    completedTasks.push(task);
    alert("Task marked as completed!");
    taskPage.innerHTML = "";
  });
}

function renderRemainingTasks() {
  const remaining = tasks.filter((task) => !task.completed);
  if (remaining.length === 0) {
    alert("No remaining tasks!");
    return;
  }

  const taskList = remaining
    .map(
            (task, index) => `
              <div class="border rounded p-3 mb-2 bg-light">
                  <h5>${index + 1}. ${task.title}</h5>
                  <p><strong>Description:</strong> ${task.desc}</p>
                  <p><strong>Date:</strong> ${task.date}</p>
                  <p><strong>Status:</strong> ${task.completed ? "Completed" : "Pending"}</p>
                  <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">Delete Task</button>
              </div>
            `
          )
          .join("");
  taskPage.innerHTML = `
  <h3>Remain Tasks</h3>
      <div class="New task">
        <ul>${taskList}</ul>
      </div>
    `;
}

const savedTaskBtn = document.getElementById("savedTaskBtn");

function renderSavedTasks() {

  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (tasks.length === 0) {
    alert("No tasks available!");
    return;
  }

  let savedTasksHTML = tasks
    .map(
      (task, index) => `
        <div class="border rounded p-3 mb-2 bg-light">
            <h5>${index + 1}. ${task.title}</h5>
            <p><strong>Description:</strong> ${task.desc}</p>
            <p><strong>Date:</strong> ${task.date}</p>
            <p><strong>Status:</strong> ${
              task.completed ? "Completed" : "Pending"
            }</p>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${
              task.id
            }">Delete Task</button>
        </div>
      `
    )
    .join("");

  taskPage.innerHTML = `
        <h3>Saved Tasks</h3>
        ${savedTasksHTML}
    `;

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = event.target.dataset.id;
      tasks = tasks.filter((task) => task.id != taskId);

    
      localStorage.setItem("tasks", JSON.stringify(tasks));

      alert("Task deleted successfully!");
      renderSavedTasks();
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const taskPage = document.getElementById("taskPage1");
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderSavedTasks();
  }
});

addTaskBtn.addEventListener("click", renderAddTaskPage);
editTaskBtn.addEventListener("click", renderEditTaskPage);
completeTaskBtn.addEventListener("click", renderCompleteTaskPage);
remainTaskBtn.addEventListener("click", renderRemainingTasks);
savedTaskBtn.addEventListener("click", renderSavedTasks);
