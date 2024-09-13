let users = [];
let tasks = [];

// Gestion des utilisateurs
function userCreator() {
    document.getElementById("userCreaName").style.display = "block";
    document.getElementById("userCreaPost").style.display = "block";
    document.getElementById("userCreaNameLab").style.display = "block";
    document.getElementById("userCreaPostLab").style.display = "block";
    document.getElementById("userCrea").style.display = "block";
}

function addUser() {
    let userName = document.getElementById('userCreaName').value;
    let userPost = document.getElementById('userCreaPost').value;

    if (userName.trim() === '' || userPost.trim() === '') {
        alert("Veuillez remplir tous les champs pour ajouter un utilisateur.");
        return;
    }

    let user = new User(userName, userPost);  // Utilisation de la classe User du fichier user.js
    users.push(user);

    addUserToList(user);

    // Ajouter l'utilisateur au menu déroulant pour l'assignation des tâches
    updateUserDropdown();

    document.getElementById('userCreaName').value = "";
    document.getElementById('userCreaPost').value = "";

    // Masquer le message d'erreur si des utilisateurs existent maintenant
    document.getElementById('error-message').style.display = 'none';
}

function addUserToList(user) {
    let userList = document.getElementById('userList');
    let listItem = document.createElement('li');
    listItem.id = `user-${users.indexOf(user)}`;
    listItem.textContent = `${user.name} (${user.post}) - Tâches assignées :`;
    let taskList = document.createElement('ul');
    taskList.id = `taskListUser-${users.indexOf(user)}`;
    listItem.appendChild(taskList);
    userList.appendChild(listItem);
}

function updateUserDropdown() {
    let userDropdown = document.getElementById('taskCreaUser');
    userDropdown.innerHTML = ''; // Clear existing options
    users.forEach((user, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = `${user.name} (${user.post})`;
        userDropdown.appendChild(option);
    });

    // Afficher ou masquer le menu déroulant en fonction du nombre d'utilisateurs
    document.getElementById('taskCreaUserLab').style.display = users.length ? 'block' : 'none';
    userDropdown.style.display = users.length ? 'block' : 'none';
}

// Gestion des tâches
function taskCreator() {
    if (users.length === 0) {
        // Afficher un message d'erreur si aucun utilisateur n'existe
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    document.getElementById("taskCreaName").style.display = "block";
    document.getElementById("taskCreaDesc").style.display = "block";
    document.getElementById("taskCreaNameLab").style.display = "block";
    document.getElementById("taskCreaDescLab").style.display = "block";
    document.getElementById("taskCreaUserLab").style.display = "block";
    document.getElementById("taskCreaUser").style.display = "block";
    document.getElementById("taskCrea").style.display = "block";
}

function sendTask() {
    if (users.length === 0) {
        // Afficher un message d'erreur si aucun utilisateur n'existe
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    let taskName = document.getElementById('taskCreaName').value;
    let taskDesc = document.getElementById('taskCreaDesc').value;
    let userId = document.getElementById('taskCreaUser').value; // ID de l'utilisateur sélectionné

    if (taskName.trim() === '' || taskDesc.trim() === '') {
        alert("Veuillez remplir tous les champs pour créer une tâche.");
        return;
    }

    let task = new Task(taskName, taskDesc);  // Utilisation de la classe Task du fichier task.js
    task.state = 1; // État par défaut à 1
    task.userId = userId; // Assigner l'utilisateur à la tâche
    tasks.push(task);

    addTaskToList('taskList1', task);

    // Ajouter la tâche à la liste des tâches de l'utilisateur
    addTaskToUserList(userId, task);

    document.getElementById('taskCreaName').value = "";
    document.getElementById('taskCreaDesc').value = "";
}

function addTaskToList(listId, task) {
    let taskList = document.getElementById(listId);
    let listItem = document.createElement('li');
    let user = users[task.userId];
    listItem.textContent = `${task.name}: ${task.desc} (Responsable: ${user.name})`;
    listItem.setAttribute('data-task-id', tasks.indexOf(task));

    // Ajouter un événement onclick pour changer l'état de la tâche
    listItem.onclick = function() {
        moveTaskToNextState(task);
    };

    taskList.appendChild(listItem);
}

function addTaskToUserList(userId, task) {
    let userTaskList = document.getElementById(`taskListUser-${userId}`);
    let listItem = document.createElement('li');
    listItem.textContent = `${task.name}: ${task.desc}`;
    userTaskList.appendChild(listItem);
}

function moveTaskToNextState(task) {
    let currentState = task.state;
    task.state = (currentState % 3) + 1;

    // Mettre à jour l'affichage de la tâche dans la liste correspondante
    document.querySelector(`#taskList${currentState} [data-task-id='${tasks.indexOf(task)}']`).remove();
    addTaskToList(`taskList${task.state}`, task);
}
