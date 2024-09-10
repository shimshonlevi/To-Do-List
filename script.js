document.addEventListener("DOMContentLoaded", function() {
    loadList(); 
});

function loadList() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.forEach(addItem);
}

function AddTask() {
    const taskText = document.getElementById("id-inp").value.trim();
    const taskNotes = document.getElementById("id-notes").value.trim();
    if (!taskText) return;

    const task = {
        id: Date.now(),
        text: taskText,
        createdDate: new Date().toLocaleDateString(),
        completed: false,
        notes: taskNotes,
    };

    addItem(task);
    saveTask(task);

    document.getElementById("id-inp").value = "";
    document.getElementById("id-notes").value = ""; // Clear notes field
}

function addItem(item) {
    const taskList = document.querySelector(".tasks-list");

    const taskdiv = document.createElement("div");
    taskdiv.classList.add("task");
    taskdiv.setAttribute("data-id", item.id);

    const taskTitle = document.createElement("span");
    taskTitle.textContent = item.text;
    taskTitle.classList.add("task-title");
    taskdiv.appendChild(taskTitle);

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Details";
    detailsButton.classList.add("details");
    detailsButton.addEventListener("click", function() {
        showDetails(item.id);
    });
    taskdiv.appendChild(detailsButton);

    const doneButton = document.createElement("button");
    doneButton.textContent = "Done";
    doneButton.classList.add("done");
    doneButton.addEventListener("click", function() {
        completeTask(item.id);
    });
    taskdiv.appendChild(doneButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", function() {
        deleteTask(item.id);
    });
    taskdiv.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");
    editButton.addEventListener("click" ,function(){
        editTask(item.id);
    });
    taskdiv.appendChild(editButton)
    

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("task-details");
    detailsDiv.style.display = "none";

    const taskTable = `
        <table>
            <tr><th>Task #</th><td>${item.id}</td></tr>
            <tr><th>Notes</th><td>${item.notes}</td></tr>
            <tr><th>Created Date</th><td>${item.createdDate}</td></tr>
        </table>
    `;
    detailsDiv.innerHTML = taskTable;
    taskdiv.appendChild(detailsDiv);
    taskList.appendChild(taskdiv);
}

function showDetails(itemId) {
    const taskDetailsDiv = document.querySelector(`.task[data-id="${itemId}"] .task-details`);
    if (taskDetailsDiv) {
        taskDetailsDiv.style.display = taskDetailsDiv.style.display === "none" ? "block" : "none";
    }
}

function completeTask(itemId) {
    const taskdiv = document.querySelector(`.task[data-id="${itemId}"]`);
    taskdiv.style.textDecoration = taskdiv.style.textDecoration === "line-through" ? "none" : "line-through";
}

function deleteTask(itemId) {
    const taskdiv = document.querySelector(`.task[data-id="${itemId}"]`);
    taskdiv.remove();
    deleteFromStorage(itemId);
}

function editTask(itemId) {
    const taskdiv = document.querySelector(`.task[data-id="${itemId}"]`);
    
    const taskTitle = taskdiv.querySelector(".task-title");
    const taskNotes = taskdiv.querySelector(".task-details table tr:nth-child(2) td"); 

   
    taskTitle.contentEditable = true;
    taskTitle.style.border = "2px solid black";
    taskNotes.contentEditable = true;
    taskNotes.style.border = "2px solid black";

 
    let saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save");
    saveButton.addEventListener("click", function() {
    
        taskTitle.contentEditable = false;
        taskTitle.style.border = "none";
        taskNotes.contentEditable = false;
        taskNotes.style.border = "none";

        updateTask(itemId, taskTitle.textContent, taskNotes.textContent);
    });

  
    if (!taskdiv.querySelector(".save")) {
        taskdiv.appendChild(saveButton);
    }
}

function updateTask(itemId, updatedText, updatedNotes) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    
  
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
        items[index].text = updatedText;
        items[index].notes = updatedNotes;
        localStorage.setItem("items", JSON.stringify(items));
    }
}

function saveTask(task) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items.push(task);
    localStorage.setItem("items", JSON.stringify(items));
}

function deleteFromStorage(itemId) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter(item => item.id !== itemId);
    localStorage.setItem("items", JSON.stringify(items));
}

function serchTask() {
    const searchValue = document.getElementById("id-serch").value.toLowerCase();
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
        const taskText = task.querySelector(".task-title").textContent.toLowerCase();
        task.style.display = taskText.includes(searchValue) ? "" : "none";
    });
}
