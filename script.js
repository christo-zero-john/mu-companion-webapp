// DOM element initialization
let formDiv = document.getElementById("form");
let dataDiv = document.getElementById("dataDiv");
let printAlertDiv = document.getElementById("alertDiv");

var getName,
  getHashtag,
  getIg,
  getDescription,
  getLink,
  getKarma,
  getTaskChannel,
  getSubmissionChannel,
  submitBtn;

var userData = {
  totalTasks: 0,
  lastTaskId: 0x1f4dc2a0b8fe54,
  removedTracks: [],
  trackedTasks: [],
};

var localData = {
  initializeLocalStorage: function () {
    console.log("Initializing localStorage");
    if (this.getUserData() == null || this.getUserData() == undefined) {
      console.log("No userData Found");
      this.putUserData(userData);
      console.log("userData initialization : success", this.getUserData());
    } else {
      console.log("User data Found!", this.getUserData());
    }

    if (this.getTasks() == null || this.getTasks() == undefined) {
      console.log("No tasks Found");
      this.putUserData(new Array());
      console.log("tasks initialization : success", this.getUserData());
    } else {
      console.log("Tasks found", this.getTasks());
    }
  },
  clearLocalStorage: function () {
    localStorage.removeItem("userData");
  },
  getTasks: function () {
    // function to retrieve all tasks from localStorage
    console.log("this.getTasks triggered");
    return JSON.parse(localStorage.getItem("tasks"));
  },
  putTasks: function (tasks) {
    console.log("this.putTasks triggered");
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.log("Error in put tasks | ", error);
    }
  },
  getUserData: function () {
    console.log("getUserdata Triggered");
    return JSON.parse(localStorage.getItem("userData"));
  },
  putUserData: function (data) {
    console.log("putUserdata Triggered");
    localStorage.setItem("userData", JSON.stringify(data));
  },
};

var appFunctions = {
  generateTaskId: function () {
    console.log("Generating Task ID");
    let userData = localData.getUserData();
    userData.lastTaskId -= 127;
    localData.putUserData(userData);
    console.log("Generated ID", userData.lastTaskId.toString(36).toUpperCase());
    return userData.lastTaskId.toString(36).toUpperCase();
  },
  addTask: function () {
    console.log("Add task Trigered");
    let task = {
      id: appFunctions.generateTaskId(),
      name: getName.value,
      hashtag: getHashtag.value,
      ig: getIg.value,
      description: getDescription.value,
      karma: getKarma.value,
      taskChannel: getTaskChannel.value,
      submissionChannel: getSubmissionChannel.value,
    };
    if (this.validateForm(task, "addTask") == true) {
      console.log(this.validateForm(task, "addTask"));
      console.log("Task ID is :", task.id);
      let tasks = localData.getTasks();
      tasks.push(task);
      localData.putTasks(tasks);
      let userData = localData.getUserData();
      userData.totalTasks++;
      localData.putUserData(userData);
      interface.hideForm();
      interface.printAlert("Task Added successfully");
      interface.hideForm();
      interface.printAllTasks();
    }
  },
  getTaskById: function (id) {
    // function to retrieve a task by id from localStorage
    console.log("appFunctions.getTaskById triggered");
    let tasks = localData.getTasks();
    for (x in tasks) {
      console.log(tasks[x].id, " : ", id);
      if (tasks[x].id == id) {
        return tasks[x];
      }
    }
    interface.printAlert("Task Not found, Error in localData.getTasks");
  },
  validateForm: function (task, type) {
    console.log("Validating fom input", task);
    let emptyFields = [];
    switch (type) {
      case "addTask": {
        for (x in task) {
          if (task[x] == null || task[x] == undefined || task[x] == "") {
            // let temp = Object.keys[task];
            emptyFields.push(x);
          }
        }
        if (emptyFields.length != 0) {
          console.log("Empty fields found", emptyFields);
          interface.printAlert(
            `All fields is not filled. If all fields are filled and you think this is an error contact support! <br> Empty fields are: ${emptyFields}`
          );
          return false;
        } else {
          console.log("No Empty fields found", emptyFields);
          return true;
        }
      }
    }
  },
  validateTracking: function (taskArray, id) {
    console.log("validate tracking : ", taskArray, id);
    if (taskArray.includes(id)) {
      console.log("Validation True : EXISTS", taskArray, id);
      return 1;
    } else {
      console.log("Validation False : NOT EXISTS", taskArray, id);

      return 0;
    }
  },
  trackTask: function (id) {
    console.log("appFunctions.trackTask triggered: ", id);
    let userData = localData.getUserData();
    if (appFunctions.validateTracking(userData.trackedTasks, id) == 1) {
      interface.printAlert("Task already tracked");
      return;
    } else {
      userData.trackedTasks.push(id);
    }
    if (appFunctions.validateTracking(userData.removedTracks, id)) {
      console.log("Task found in removed tracks List");
      userData.removedTracks.splice(userData.removedTracks.indexOf(id), 1);
      console.log("Task removed from removed tracks List");
    }
    localData.putUserData(userData);
    interface.printAlert("Task tracked successfully");
  },
  removeTrackedTask: function (id) {
    console.log("appFunctions.removeTrackedTask triggered");
    let userData = localData.getUserData();
    let trackedTasks = userData.trackedTasks;
    for (x in trackedTasks) {
      let task = appFunctions.getTaskById(trackedTasks[x]);
      if (task.id == id) {
        console.log("Task Found");
        userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
        userData.removedTracks.push(id);
        localData.putUserData(userData);
        interface.printAlert(
          "Task Removed successfully. You can view it in the removed tracks list"
        );
        interface.printTrackedTasks();
        break;
      }
    }
  },
  deleteTask: function (id) {
    console.log(`Started deleting task ${id}`);
    let userData = localData.getUserData();
    let tasks = localData.getTasks();
    if (
      window.confirm(
        "Do you really want to delete this Task! This action cannot be undone. The task will be deleted from the database, tracked tasks and all the references to this task will be deleted!!"
      )
    ) {
      for (x in tasks) {
        if (tasks[x].id == id) {
          console.log("Task found at ", x);
          tasks.splice(x, 1);
          if (userData.trackedTasks.includes(id)) {
            console.log("Task found in trackedTasks");
            userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
          }
          if (userData.removedTracks.includes(id)) {
            console.log("Task found in removedTracks");
            userData.removedTracks.splice(
              userData.removedTracks.indexOf(id),
              1
            );
          }
          localData.putTasks(tasks);
          localData.putUserData(userData);
          console.log(
            `Task ${id} deleted successfully and userData and tasks saved to the storage`
          );
        }
      }
      interface.printAlert("Task and all its references deleted successfully");
    }
    interface.printAllTasks();
  },
};

var interface = {
  printAlert: async function (message) {
    alertDiv.style.display = "block";
    alertDiv.innerHTML = `
    <button type="button" class="" id="closeAlert" onclick="interface.hideAlert()">Close</button>
    <p class="alertMessage">${message}</p>
  `;
    await delay(4000);
    interface.hideAlert();
  },
  hideAlert: function () {
    alertDiv.innerHTML = "";
    alertDiv.style.display = "none";
  },
  clearDataDiv: function () {
    dataDiv.innerHTML = "";
  },
  taskForm: function () {
    console.log("Task Form UI Printed");

    formDiv.style.display = "block";
    formDiv.innerHTML = `
        <button type="button" class="closeForm" onclick="interface.hideForm()">close</button>
        <input id="name" type="text" class="" placeholder="Title(name)">
        <input id="hashtag" type="text" class="" placeholder="Hashtag">
        <input id="ig" type="text" class="" placeholder="Interest Group">
        <input id="description" type="text" class="" placeholder="Task Description">
        <input id=taskLink" type="text" class="" placeholder="Link to task">
        <input id="karma" type="text" class="" placeholder="Karma Points">
        <input id="taskChannel" type="text" class="" placeholder="Channel which defines this task">
        <input id="submissionChannel" type="text" class="" placeholder="Channel to submit task">
        <button id="submitBtn" type="button">Add Task</button>
      `;
    getName = document.getElementById("name");
    getHashtag = document.getElementById("hashtag");
    getIg = document.getElementById("ig");
    getDescription = document.getElementById("description");
    getTaskLink = document.getElementById("taskLink");
    getKarma = document.getElementById("karma");
    getTaskChannel = document.getElementById("taskChannel");
    getSubmissionChannel = document.getElementById("submissionChannel");
    submitBtn = document.getElementById("submitBtn");
    getHashtag.addEventListener("input", function () {
      let tasks = localData.getTasks();
      for (x in tasks) {
        if (tasks[x].hashtag == getHashtag.value) {
          interface.printAlert(
            "This hashtag already exists in the tasks list! You can't add a duplicate tasks"
          );
          submitBtn.disabled = true;
          break;
        } else {
          submitBtn.disabled = false;
        }
      }
    });
  },
  hideForm: function () {
    formDiv.style.display = "none";
  },
  addTaskForm: function () {
    console.log("Add task UI Printed");
    interface.taskForm();
    submitBtn.addEventListener("click", function () {
      appFunctions.addTask();
    });
  },
  printTask: function (task, type) {
    switch (type) {
      case "all": {
        buttonDiv = `             
                <div id="buttonDiv">
                    <button type="button" class="track" onclick="appFunctions.trackTask('${task.id}')">Track</button>
                    <button type="button" class="delete" onclick="appFunctions.deleteTask('${task.id}')">Delete</button>
                </div>
              `;
        break;
      }
      case "tracked": {
        buttonDiv = `             
            <div id="buttonDiv">
                <button type="button" class="track" onclick="appFunctions.removeTrackedTask('${task.id}')">Remove</button>
            </div>
        `;
        break;
      }
      case "removedTracks": {
        buttonDiv = `             
          <div id="buttonDiv">
              <button type="button" class="track" onclick="appFunctions.trackTask('${task.id}')">Track</button>
          </div>
        `;
        break;
      }
    }
    dataDiv.innerHTML += `
        <div class="task-item">
        <p class="title">ID ${task.id}</p>
          <p class="title">Title: ${task.name}</p>
          <p class="hashtag">Hashtag: ${task.hashtag}</p>
          <p class="ig">${task.ig}</p>
          <p class="desc">Description: ${task.description}</p>
          <p class="karma">${task.karma}</p>
          <p class="taskChannel">${task.taskChannel}</p>
          <p class="submissionChannel">${task.submissionChannel}</p>
          ${buttonDiv}
        </div>       
      `;
  },
  printAllTasks: function () {
    interface.clearDataDiv();
    var tasks = localData.getTasks(tasks);
    console.log("All tasks | ", tasks);
    if (tasks.length == 0) {
      dataDiv.innerHTML = `No tasks Available`;
      console.log("No tasks Available");
    } else {
      for (x in tasks) {
        interface.printTask(tasks[x], "all");
      }
    }
  },
  printTrackedTasks: function () {
    console.log("interface.printTrackedTasks triggered");
    let trackedTasks = localData.getUserData().trackedTasks;
    console.log(trackedTasks);
    interface.clearDataDiv();
    if (trackedTasks.length == 0) {
      dataDiv.innerHTML = "You don't have any track history";
    } else {
      for (x in trackedTasks) {
        interface.printTask(
          appFunctions.getTaskById(trackedTasks[x]),
          "tracked"
        );
      }
    }
  },
  printRemovedTracks: function () {
    console.log("Print removed tracks triggered");
    let userData = localData.getUserData();
    console.log(userData);
    interface.clearDataDiv();
    if (userData.removedTracks.length == 0) {
      dataDiv.innerHTML = `You don't have any removed trackings`;
    } else {
      for (x in userData.removedTracks) {
        interface.printTask(
          appFunctions.getTaskById(userData.removedTracks[x]),
          "removedTracks"
        );
      }
    }
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function main()
{
  localData.initializeLocalStorage()  
}
;

main();
// localData.clearLocalStorage();

//----------------------------------------------------------------------------------------

function uiEditTask(index) {
  console.log("UI Edit task Printed");
  console.log("index: ", index);
  interface.taskForm();
  let tasks = localData.getTasks();
  getName.value = tasks[index].name;
  getHashtag.value = tasks[index].hashtag;
  getIg.value = tasks[index].ig;
  getDescription.value = tasks[index].description;
  getKarma.value = tasks[index].karma;
  getTaskChannel.value = tasks[index].taskChannel;
  getSubmissionChannel.value = tasks[index].submissionChannel;
  submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", function () {
    let task = {
      name: getName.value,
      hashtag: getHashtag.value,
      ig: getIg.value,
      description: getDescription.value,
      karma: getKarma.value,
      taskChannel: getTaskChannel.value,
      submissionChannel: getSubmissionChannel.value,
    };
    saveEdits(task, index);
    interface.hideForm();
  });
}

function saveEdits(task, index) {
  console.log("Save edits Trigered at ", index, task);
  let tasks = localData.getTasks();
  tasks[index] = task;
  localData.putTasks(tasks);
  interface.printAllTasks();
  // console.log("task: ", task);
}
// function getTrackedTasks() {
//   console.log("getTrackedTasks triggered");
//   return JSON.parse(localStorage.getItem("trackedTasks"));
// }

// function putTrackedTasks(trackedTasks) {
//   console.log("putTrackedTasks triggered", trackedTasks);
//   localStorage.setItem("trackedTasks", JSON.stringify(trackedTasks));
// }

/*
  27 functions 
  3 objects
  386 lines of code
*/
