document.addEventListener('DOMContentLoaded', loadTasks);

const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const filters = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addTaskBtn.addEventListener('click', addTask);
filters.forEach(filter => filter.addEventListener('click', filterTasks));

function addTask() {
  const taskName = document.getElementById('taskName').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const priority = document.getElementById('taskPriority').value;
  const category = document.getElementById('taskCategory').value;

  if (!taskName) return alert('Task name is required!');

  const newTask = {
    id: Date.now(),
    name: taskName,
    dueDate,
    priority,
    category,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  clearInputFields();
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task ${task.completed ? 'completed' : ''}`;
    taskItem.innerHTML = `
      <span>${task.name} (${task.priority}) - ${task.dueDate}</span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function toggleComplete(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function filterTasks(e) {
  renderTasks(e.target.dataset.filter);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks();
}

function clearInputFields() {
  document.getElementById('taskName').value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskCategory').value = '';
}
