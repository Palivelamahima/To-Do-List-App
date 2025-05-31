let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    date: new Date().toISOString().split("T")[0],
    priority: "High", // Default priority
    completed: false
  };

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
  updateCount();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const filter = document.getElementById("priorityFilter").value;
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task =>
    filter === "All" ? true : task.priority === filter
  );

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span onclick="toggleComplete(${task.id})">
        ${task.text}
        <small>${task.date} | ${task.priority}</small>
      </span>
      <div class="actions">
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="removeTask(${task.id})">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  updateCount();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  tasks = stored ? JSON.parse(stored) : [];
  renderTasks();
  updateCount();
}

function updateCount() {
  const taskCount = tasks.length;
  document.getElementById("taskCount").textContent = `${taskCount} task${taskCount !== 1 ? "s" : ""}`;
}

// Add task on Enter key
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

window.onload = loadTasks;

