const API_URL = 'http://localhost:5000/api';
const app = document.getElementById("app");

let token = localStorage.getItem('token');
let categories = [];
let selectedCategory = null;
let editMode = null;
let taskChart = null;


function formatDateTime(dateString) {
  const d = new Date(dateString);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} – ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatDateTimeLocal(dateStr) {
  const d = new Date(dateStr);
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function render(templateId) {
  app.innerHTML = '';
  app.appendChild(document.getElementById(templateId).content.cloneNode(true));
  bindEvents(templateId);
}

function bindEvents(templateId) {
  if (templateId === "login-template") {
    document.getElementById("go-register").onclick = () => render("register-template");

    document.getElementById("login-form").onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        token = data.token;
        render("dashboard-template");
        await loadCategories();
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    };
  }

  else if (templateId === "register-template") {
    document.getElementById("go-login").onclick = () => render("login-template");

    document.getElementById("register-form").onsubmit = async (e) => {
      e.preventDefault();
      const username = document.getElementById("register-username").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;

      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert("Register successful! Please login.");
        render("login-template");
      } catch (err) {
        alert("Register failed: " + err.message);
      }
    };
  }

  else if (templateId === "dashboard-template") {
    document.getElementById("logout-btn").onclick = () => {
      if (confirm("Logout?")) {
        localStorage.removeItem("token");
        token = null;
        render("login-template");
      }
    };

    document.getElementById("add-category-form").onsubmit = addCategory;

    document.getElementById("add-task-form").onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById("task-title").value.trim();
      const content = document.getElementById("task-content").value.trim();
      const startTime = document.getElementById("task-start").value;
      const endTime = document.getElementById("task-end").value;
      const done = document.getElementById("task-done").checked;

      if (!title || !content || !startTime || !endTime) {
        alert("Please fill in all fields.");
        return;
      }

      const taskData = { title, content, startTime, endTime, done };

      try {
        if (editMode) {
          const res = await fetch(`${API_URL}/categories/${selectedCategory._id}/tasks/${editMode._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
          });

          if (!res.ok) throw new Error("Failed to update task");
          alert("Task updated successfully!");
          editMode = null;
        } else {
          const res = await fetch(`${API_URL}/categories/${selectedCategory._id}/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
          });

          if (!res.ok) throw new Error("Failed to add task");
          alert("Task added successfully!");
        }

        document.getElementById("add-task-form").reset();
        document.querySelector("#add-task-form button[type=submit]").textContent = "Add Task";
        await loadTasksByCategory(selectedCategory._id, false);
        displayTasks();
        renderChartForCurrentMonth();
      } catch (err) {
        alert("Error: " + err.message);
      }
    };

    if (selectedCategory) {
      document.getElementById("selected-category-title").textContent = selectedCategory.name;
      document.getElementById("add-task-form").classList.remove("hidden");
      displayTasks();
      renderChartForCurrentMonth();
    }

    const monthInput = document.getElementById("month-selector");
    if (monthInput) {
      monthInput.value = new Date().toISOString().slice(0, 7);
      monthInput.onchange = () => {
        renderChartForCurrentMonth();
      };
    }

    displayCategories();
  }
}

async function loadCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    categories = data;

    if (selectedCategory) {
      const match = categories.find(c => c._id === selectedCategory._id);
      if (match) {
        await loadTasksByCategory(match._id);
        return;
      } else {
        selectedCategory = null;
      }
    }

    render("dashboard-template");
  } catch (err) {
    alert("Failed to load categories: " + err.message);
  }
}

async function loadTasksByCategory(categoryId, rerender = true) {
  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const tasks = await res.json();
    const category = categories.find(c => c._id === categoryId);
    if (category) {
      category.tasks = tasks;
      selectedCategory = category;
    }

    if (rerender){
      render("dashboard-template");
      renderChartForCurrentMonth();
    } 
  } catch (err) {
    alert("Failed to load tasks: " + err.message);
  }
}

async function addCategory(e) {
  e.preventDefault();
  const name = document.getElementById("new-category").value.trim();
  if (!name) return;

  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) throw new Error("Failed to add category");
    await loadCategories();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function displayCategories() {
  const ul = document.getElementById("category-list");
  ul.innerHTML = "";

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.classList.add("category-item");

    li.onclick = (e) => {
      if (e.target.classList.contains("delete-category-btn")) return;
      loadTasksByCategory(cat._id);
    };

    const span = document.createElement("span");
    span.textContent = cat.name;
    span.className = "category-name";

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.className = "delete-category-btn";
    btn.onclick = async (ev) => {
      ev.stopPropagation();
      if (!confirm(`Delete category "${cat.name}"?`)) return;

      try {
        const res = await fetch(`${API_URL}/categories/${cat._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error();
        categories = categories.filter(c => c._id !== cat._id);
        if (selectedCategory && selectedCategory._id === cat._id) {
          selectedCategory = null;
        }
        render("dashboard-template");
      } catch {
        alert("Failed to delete category.");
      }
    };

    li.append(span, btn);
    ul.appendChild(li);
  });
}

function displayTasks() {
  const ul = document.getElementById("task-list");
  ul.innerHTML = "";

  if (!selectedCategory || !selectedCategory.tasks?.length) {
    ul.innerHTML = "<li>No tasks in this category.</li>";
    return;
  }

  selectedCategory.tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <div class="task-grid">
        <div class="task-title">${task.title} ${task.done ? '<span style="color: green;">✅</span>' : ''}</div>
        <div class="task-content">${task.content}</div>
        <div class="task-time"><small>${formatDateTime(task.startTime)} → ${formatDateTime(task.endTime)}</small></div>
      </div>
    `;
    li.onclick = () => showPopup(task, idx);
    ul.appendChild(li);
  });
}

function showPopup(task, idx) {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");

  document.getElementById("popup-title").textContent = "Title: " + task.title;
  document.getElementById("popup-content").textContent = "Content: " + task.content;
  document.getElementById("popup-start").textContent = "Start: " + formatDateTime(task.startTime);
  document.getElementById("popup-end").textContent = "End: " + formatDateTime(task.endTime);
  document.getElementById("popup-done").textContent = "Done: " + (task.done ? "Yes" : "No");

  document.getElementById("popup-close").onclick = () => popup.classList.add("hidden");

  document.getElementById("popup-delete").onclick = async () => {
    if (!confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API_URL}/categories/${task.category}/tasks/${task._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();
      alert("Task deleted.");
      popup.classList.add("hidden");
      await loadTasksByCategory(selectedCategory._id, false);
      displayTasks();
      renderChartForCurrentMonth();
    } catch {
      alert("Failed to delete task.");
    }
  };

  document.getElementById("popup-edit").onclick = () => {
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-content").value = task.content;
    document.getElementById("task-start").value = formatDateTimeLocal(task.startTime);
    document.getElementById("task-end").value = formatDateTimeLocal(task.endTime);
    document.getElementById("task-done").checked = task.done;
    document.querySelector("#add-task-form button[type=submit]").textContent = "Update Task";
    popup.classList.add("hidden");
    editMode = task;
  };
}

// App khởi động
if (token) {
  render("dashboard-template");
  loadCategories();
} else {
  render("login-template");
}

function renderChartForCurrentMonth() {
  if (!selectedCategory || !selectedCategory.tasks) return;

  const selectedMonthInput = document.getElementById("month-selector")?.value;
  const now = selectedMonthInput ? new Date(selectedMonthInput) : new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const tasksInMonth = selectedCategory.tasks.filter(task => {
    const taskDate = new Date(task.startTime);
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });

  const doneTasks = tasksInMonth.filter(t => t.done).length;
  const notDoneTasks = tasksInMonth.length - doneTasks;

  const ctx = document.getElementById("task-chart")?.getContext("2d");
  if (!ctx) return;

  if (window.taskPieChart) window.taskPieChart.destroy();

  window.taskPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Đã hoàn thành', 'Chưa hoàn thành'],
      datasets: [{
        data: [doneTasks, notDoneTasks],
        backgroundColor: ['#4CAF50', '#F44336'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Tổng quan công việc tháng ${currentMonth + 1}/${currentYear}`,
        },
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

function updateChart(tasks) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const tasksInMonth = tasks.filter(task => {
    const taskDate = new Date(task.start);
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });

  const completed = tasksInMonth.filter(task => task.done).length;
  const incomplete = tasksInMonth.length - completed;

  const ctx = document.getElementById('task-pie-chart')?.getContext('2d');
  if (!ctx) return; // Nếu chưa render dashboard

  if (taskChart) taskChart.destroy(); // Xoá biểu đồ cũ

  taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Hoàn thành', 'Chưa hoàn thành'],
      datasets: [{
        label: 'Công việc trong tháng',
        data: [completed, incomplete],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

