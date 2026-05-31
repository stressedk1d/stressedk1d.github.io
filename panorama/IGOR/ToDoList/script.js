const STORAGE_KEY = "mini-todo-tasks";
const form = document.getElementById("todo-form");
const newTaskInput = document.getElementById("new-task");
const taskList = document.getElementById("task-list");
const statsEl = document.getElementById("todo-stats");

let tasks = loadTasks();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  newTaskInput.value = "";
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function render() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `todo-item${task.done ? " is-done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "todo-item__text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "todo-delete";
    deleteBtn.setAttribute("aria-label", "Удалить");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, deleteBtn);
    taskList.appendChild(li);
  });

  const done = tasks.filter((t) => t.done).length;
  statsEl.textContent = tasks.length
    ? `${tasks.length - done} активных · ${done} выполнено`
    : "";
}
