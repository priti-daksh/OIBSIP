const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Format time
function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Display tasks
function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent = `${pending.length} pending`;
    completedCount.textContent = `${completed.length} completed`;

    if (pending.length === 0) {
        pendingTasks.innerHTML =
            `<p class="empty-message">No pending tasks. You're all caught up! 🎉</p>`;
    }

    if (completed.length === 0) {
        completedTasks.innerHTML =
            `<p class="empty-message">No completed tasks yet.</p>`;
    }

    pending.forEach(task => {
        pendingTasks.appendChild(createTaskElement(task));
    });

    completed.forEach(task => {
        completedTasks.appendChild(createTaskElement(task));
    });
}

// Create task element
function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.innerHTML = `
        <div class="task-info">
            <div class="task-text">${task.text}</div>
            <div class="task-time">
                Added: ${formatTime(task.createdAt)}
            </div>
        </div>

        <div class="task-actions">

            <button class="complete-btn" title="Mark Complete">
                <i class="fa-solid fa-check"></i>
            </button>

            <button class="edit-btn" title="Edit Task">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="delete-btn" title="Delete Task">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;

    // Complete button
    taskItem.querySelector(".complete-btn").addEventListener("click", () => {

        task.completed = !task.completed;

        saveTasks();
        renderTasks();
    });

    // Edit button
    taskItem.querySelector(".edit-btn").addEventListener("click", () => {

        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {

            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        }
    });

    // Delete button
    taskItem.querySelector(".delete-btn").addEventListener("click", () => {

        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();
        renderTasks();
    });

    return taskItem;
}

// Add new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Add button
addTaskBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }
});

// Initial display
renderTasks();
