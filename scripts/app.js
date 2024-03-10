// global variables
var condition = false,
  temp,
  formDiv,
  dataDiv,
  modalDiv,
  modalTitle,
  modalBody,
  modalBtn,
  alertDiv,
  searchDiv,
  searchBox,
  getName,
  getHashtag,
  getIg,
  getDescription,
  getLink,
  getKarma,
  getTaskChannel,
  getSubmissionChannel,
  submitBtn;

// DOM element initialization

var basicData = {
  interestGroups: [
    {
      name: "General Enablement",
      code: "ge",
    },
    {
      name: "Web Development",
      code: "webdev",
    },
    {
      name: "Cyber Security",
      code: "cybersec",
    },
    {
      name: "Artificial Intelligence",
      code: "ai",
    },
    {
      name: "Beckn",
      code: "bekn",
    },
    {
      name: "Ui & Ux Designing",
      code: "uiux",
    },
    {
      name: "Internet of Things",
      code: "iot",
    },
    {
      name: "Cloud and DevOps",
      code: "devops",
    },
    {
      name: "No or Low code development",
      code: "nocode",
    },
    {
      name: "Product Management",
      code: "prdctmt",
    },
    {
      name: "Entrepreneurship",
      code: "entrprnr",
    },
    {
      name: "Ar Vr Mr",
      code: "xr",
    },
    {
      name: "Mobile Development",
      code: "mobdev",
    },
    {
      name: "Marketing",
      code: "mrktng",
    },
    {
      name: "3D Animation and Game Development",
      code: "3dagdev",
    },
    {
      name: "Competitive Coding",
      code: "code",
    },
    {
      name: "Blockchain Development",
      code: "blkchn",
    },
    {
      name: "Strategic Leadership",
      code: "strldr",
    },
    {
      name: "Civil Engineering",
      code: "civil",
    },
    {
      name: "Creative Design",
      code: "crtvdsn",
    },
    {
      name: "Quality Assurance",
      code: "qa",
    },
  ],
  lastTaskId: 0x1f4dc2a0b8fe54,
};

var userData = {
  name: "Christo John",
  userName: "christojohn",
  userId: "nx2jf9m49wm",
  totalTracking: 0,
  removedTracks: [],
  trackedTasks: [],
  completedTasks: [],
  roles: ["superAdmin", "admin", "moderator", "user"],
  totalKarma: 0,
};

var localData = {
  /*
    Things in local Storage
    1. userData : To store userdata
    2. tasks : To store tasks
    3. userTasks : To store tasks created by the user
    4. basicdata: To store common data. Retrieved from and stored in firebase and a local copy in user device
  */

  initializeLocalStorage: function () {
    //console.log("Initializing localStorage");
    if (this.getUserData() == null || this.getUserData() == undefined) {
      //console.log("No userData Found");
      this.putUserData(userData);
      //console.log("userData initialization : success", this.getUserData());
    } else {
      //console.log("User data Found!", this.getUserData());
    }

    if (this.getTasks() == null || this.getTasks() == undefined) {
      //console.log("No tasks Found");
      this.putTasks(new Array());
      //console.log("tasks initialization : success", this.getTasks());
    } else {
      //console.log("Tasks found", this.getTasks());
    }

    if (this.getBasicData() == null || this.getBasicData() == undefined) {
      console.log("getBasicData Not Found");
      this.putBasicdata(basicData);
      console.log("getBasicData initialization : success", this.getBasicData());
    } else {
      console.log("Basicdata found", this.getBasicData());
    }
  },
  clearLocalStorage: function () {
    localStorage.removeItem("userData");
  },
  getBasicData: function () {
    return JSON.parse(localStorage.getItem("basicData"));
  },
  putBasicdata: function (data) {
    localStorage.setItem("basicData", JSON.stringify(data));
  },
  getTasks: function () {
    // function to retrieve all tasks from localStorage
    //console.log("this.getTasks triggered");
    return JSON.parse(localStorage.getItem("tasks"));
  },
  putTasks: function (tasks) {
    //console.log("this.putTasks triggered");
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      //console.log("Error in put tasks | ", error);
    }
  },
  getUserData: function () {
    //console.log("getUserdata Triggered");
    return JSON.parse(localStorage.getItem("userData"));
  },
  putUserData: function (data) {
    console.log("putUserdata Triggered");
    localStorage.setItem("userData", JSON.stringify(data));
    console.log(this.getUserData());
  },
  getUserTasks: function () {
    //console.log("localData.getUserTasks Triggered");
    return JSON.parse(localStorage.getItem("userTasks"));
  },
  putUserTasks: function (data) {
    //console.log("putUserTasks Triggered");
    localStorage.setItem("userTasks", JSON.stringify(data));
  },
};

var tasksMods = {
  trackTask: function (id) {
    let tasks = localData.getTasks();
    let index = appFunctions.getTaskIndex(id);
    tasks[index].totalPeopleTracked++;
    tasks[index].totalPeopleCurrentlyTracking++;
    localData.putTasks(tasks);
    console.log(tasks[index]);
    console.log(localData.getTasks());
  },
};

var appFunctions = {
  generateTaskId: function () {
    //console.log("Generating Task ID");
    let basicData = localData.getBasicData();
    basicData.lastTaskId -= 127;
    localData.putBasicdata(basicData);
    //console.log("Generated ID", basicData.lastTaskId.toString(36).toUpperCase());
    return basicData.lastTaskId.toString(36).toUpperCase();
  },
  addTask: function () {
    //console.log("Add task Trigered");
    let task = {
      id: appFunctions.generateTaskId(),
      name: getName.value,
      hashtag: getHashtag.value,
      ig: getIg.value == "" ? "none" : getIg.value,
      description:
        getDescription.value == "" ? getName.value : getDescription.value,
      karma: getKarma.value,
      taskChannel: getTaskChannel.value == "" ? "none" : getTaskChannel.value,
      submissionChannel:
        getSubmissionChannel.value == "" ? "none" : getSubmissionChannel.value,
    };
    if (this.validateForm(task, "addTask") == true) {
      task.trackTask = 0;
      task.totalPeopleCompleted = 0;
      task.totalPeopleCurrentlyTracking = 0;
      task.reviews = [];
      console.log(task);
      //console.log("Task ID is :", task.id);
      let tasks = localData.getTasks();
      tasks.push(task);
      localData.putTasks(tasks);
      interface.hideForm();
      interface.printAlert("Task Added successfully");
      interface.hideForm();
      interface.printAllTasks();
    }
  },
  getTaskById: function (id) {
    // function to retrieve a task by id from localStorage
    //console.log("appFunctions.getTaskById triggered");
    let tasks = localData.getTasks();
    for (x in tasks) {
      //console.log(tasks[x].id, " : ", id);
      if (tasks[x].id == id) {
        return tasks[x];
      }
    }
    interface.printAlert("Task Not found, Error in localData.getTasks");
  },
  getTaskIndex: function (id) {
    // function to retrieve index of a task fromits id
    //console.log("appFunctions.getTaskById triggered");
    let tasks = localData.getTasks();

    for (x = 0; x < tasks.length; x++) {
      //console.log(tasks[x].id, " : ", id);
      if (tasks[x].id == id) {
        return x;
      }
    }
    interface.printAlert("Task Not found, Error in localData.getTasks");
  },
  validateForm: function (task, type) {
    //console.log("Validating fom input", task);
    let emptyFields = [];
    switch (type) {
      case "addTask": {
        for (x in task) {
          if (task[x] == null || task[x] == undefined || task[x] == "") {
            // let userData = Object.keys[task];
            emptyFields.push(x);
          }
        }
        if (emptyFields.length != 0) {
          //console.log("Empty fields found", emptyFields);
          interface.printAlert(
            `All fields is not filled. If all fields are filled and you think this is an error contact support! <br> Empty fields are: ${emptyFields}`
          );
          return false;
        } else {
          //console.log("No Empty fields found", emptyFields);
          return true;
        }
      }
    }
  },
  validateTracking: function (taskArray, id) {
    //console.log("validate tracking : ", taskArray, id);
    if (taskArray.includes(id)) {
      //console.log("Validation True : EXISTS", taskArray, id);
      return 1;
    } else {
      //console.log("Validation False : NOT EXISTS", taskArray, id);

      return 0;
    }
  },
  trackTask: async function (id, context) {
    let condition = false;
    // here context means where the function is called from. For example from printAll tasks or view removed tracks etc...
    console.log("Tracktask triggered");
    condition = await interface.confirmActionModal(
      "Track task",
      `Do you want to add this task: ${
        appFunctions.getTaskById(id).name
      } to your task list. <br><br> Points:${
        appFunctions.getTaskById(id).karma
      } `
    );
    if (condition == true) {
      console.log("Tracking task");
      let userData = localData.getUserData();
      if (
        appFunctions.validateTracking(userData.trackedTasks, id) &&
        appFunctions.validateTracking(userData.completedTasks, id)
      ) {
        interface.printAlert("Task already tracked or completed");
        return;
      } else {
        userData.trackedTasks.push(id);
        tasksMods.trackTask(id);
        userData.totalTracking++;
      }
      if (appFunctions.validateTracking(userData.removedTracks, id)) {
        //console.log("Task found in removed tracks List");
        userData.removedTracks.splice(userData.removedTracks.indexOf(id), 1);
        //console.log("Task removed from removed tracks List");
      }
      localData.putUserData(userData);
      interface.printAlert("Task tracked successfully");
      switch (context) {
        case "all": {
          interface.printAllTasks();
          break;
        }
        case "removed": {
          interface.printRemovedTracks();
        }
      }
    }
  },
  removeTrackedTask: async function (id, context) {
    //console.log("appFunctions.removeTrackedTask triggered");
    condition = await interface.confirmActionModal(
      "Remove Task",
      `Do you want to remove ${
        appFunctions.getTaskById(id).name
      } from your tasks list. You can see Removed tasks can in the Removed tasks list.`
    );
    if (condition == true) {
      let userData = localData.getUserData();
      let trackedTasks = userData.trackedTasks;
      let tasks = localData.getTasks();
      let index = appFunctions.getTaskIndex(id);
      console.log(this.getTaskById(id), index);
      tasks[index].totalPeopleCurrentlyTracking--;
      console.log(this.getTaskById(id), index);
      localData.putTasks(tasks);
      for (x in trackedTasks) {
        let task = appFunctions.getTaskById(trackedTasks[x]);
        if (task.id == id) {
          //console.log("Task Found");
          userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
          userData.removedTracks.push(id);
          localData.putUserData(userData);
          interface.printAlert(
            "Task Removed successfully. You can view it in the removed tracks list"
          );
          interface.printTrackedTasks();
          console.log("Task removed from the list");
          switch (context) {
            case "all": {
              interface.printAllTasks();
              break;
            }
            case "tracked": {
              interface.printTrackedTasks();
              break;
            }
          }
          break;
        }
      }
    }
  },
  deleteTask: async function (id) {
    //console.log(`Started deleting task ${id}`);
    let condition = await interface.confirmActionModal(
      "Delete task",
      `Do you want to delete this task ${
        this.getTaskById(id).name
      }! <br><br> Admin operation <br><br> Deleted Tasks and all its references wil be removed. Also they will be deleted from the database as well.`
    );
    if (condition == true) {
      let userData = localData.getUserData();
      let tasks = localData.getTasks();
      for (x in tasks) {
        if (tasks[x].id == id) {
          //console.log("Task found at ", x);
          tasks.splice(x, 1);
          if (userData.trackedTasks.includes(id)) {
            //console.log("Task found in trackedTasks");
            userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
          }
          if (userData.removedTracks.includes(id)) {
            //console.log("Task found in removedTracks");
            userData.removedTracks.splice(
              userData.removedTracks.indexOf(id),
              1
            );
          }
          if (userData.completedTasks.includes(id)) {
            userData.completedTasks.splice(
              userData.completedTasks.indexOf(id),
              1
            );
            userData.totalKarma -= +appFunctions.getTaskById(id).karma;
          }

          localData.putTasks(tasks);
          localData.putUserData(userData);
          interface.printAlert(
            `Task and all its assosciated data deleted successfully`
          );
        }
      }

      interface.deleteTasks();
    }
  },
  markAsCompleted: function (id) {
    console.log("marking task as completed");
    if (
      window.confirm(
        "Once you mark it as completed, you cannot track or schedule it again. DO NOT click OK if you are not sure about it!"
      )
    ) {
      let userData = localData.getUserData();
      let tasks = localData.getTasks();
      userData.completedTasks.push(id);
      userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
      tasks[this.getTaskIndex(id)].totalPeopleCurrentlyTracking--;
      tasks[this.getTaskIndex(id)].totalPeopleCompleted++;
      userData.totalKarma += +this.getTaskById(id).karma;
      localData.putUserData(userData);
      localData.putTasks(tasks);
      interface.printAlert("Task successfully   marked as complete");
      interface.printTrackedTasks();
    }
  },
  removeCompleted: function (id) {
    console.log("Removing task from marked as completed");
    let userData = localData.getUserData();
    if (userData.completedTasks.includes(id)) {
      userData.completedTasks.splice(indexOf(id), 1);
    } else {
      printAlert("Some error occurred while removing from the list!");
    }
  },
  searchTask: function (searchTerm) {
    console.log(searchTerm);
    let tasks = localData.getTasks();
    console.log(tasks);
  },
};

var interface = {
  initializeDivs: function () {
    this.createDataDiv();
    this.createFormDiv();
    this.createSearchDiv();
    this.createAlertDiv();
    this.createModalDiv();
  },
  createDataDiv: function () {
    let div = document.createElement("div");
    div.id = "dataDiv";
    document.body.appendChild(div);
    dataDiv = document.getElementById("dataDiv");
  },
  createFormDiv: function () {
    let div = document.createElement("div");
    div.id = "formDiv";
    document.body.appendChild(div);
    formDiv = document.getElementById("formDiv");
  },
  createSearchDiv: function () {
    let div = document.createElement("div");
    div.id = "searchDiv";
    document.body.appendChild(div);
    searchDiv = document.getElementById("searchDiv");
  },
  createModalDiv: function () {
    let div = document.createElement("div");
    div.id = "modalDiv";
    document.body.appendChild(div);
    modalDiv = document.getElementById("modalDiv");
    modalDiv.innerHTML = `
      <div class="modal fade" tabindex="-1" id="confirmModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-dark">
              <h5 class="modal-title text-wheat" id="modalTitle">Confirm</h5>
              <button
                type="button"
                class="btn-close bg-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body bg-dark" id="modalBody"></div>
            <div class="modal-footer bg-dark">
              <button id="modalBtn"
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    modalTitle = document.getElementById("modalTitle");
    modalBody = document.getElementById("modalBody");
    modalBtn = document.getElementById("modalBtn");
  },
  createAlertDiv: function () {
    let div = document.createElement("div");
    div.id = "alertDiv";
    document.body.appendChild(div);
    alertDiv = document.getElementById("alertDiv");
  },
  confirmActionModal: function (title, message) {
    confirmAction = new Promise((resolve) => {
      $("#confirmModal").modal("show");
      modalTitle.innerHTML = `<p class="modalTitle">${title}</p>`;
      modalBody.innerHTML = `
        <p class="modalMessage">${message}</p>
      `;
      modalBtn.addEventListener("click", function () {
        resolve(true);
        $("#confirmModal").modal("hide");
      });
    });
    return confirmAction;
  },
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
    //console.log("Task Form UI Printed");
    formDiv.style.display = "block";
    let interestGroups = localData.getBasicData().interestGroups;
    let options = `<option class="" value="">Select Interest Group</option>`;
    for (x in interestGroups) {
      // console.log("adding options");
      options += `
        <option class="${interestGroups[x].code}" value="">${interestGroups[x].name}</option>
      `;
    }
    formDiv.innerHTML = `
        <button type="button" class="closeForm" onclick="interface.hideForm()">close</button>
        <input id="taskName" type="text" class="" placeholder="Title(name)">
        <input id="hashtag" type="text" class="" placeholder="Hashtag">
        <select name="interestGroups" id="ig">${options}</select>
        <input id="description" type="text" class="" placeholder="Task Description">
        <input id=taskLink" type="text" class="" placeholder="Link to task">
        <input id="karma" type="text" class="" placeholder="Karma Points">
        <input id="taskChannel" type="text" class="" placeholder="Channel which defines this task">
        <input id="submissionChannel" type="text" class="" placeholder="Channel to submit task">
        <button id="submitBtn" type="button">Add Task</button>
      `;
    getName = document.getElementById("taskName");
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
    //console.log("Add task UI Printed");
    interface.taskForm();
    submitBtn.addEventListener("click", function () {
      appFunctions.addTask();
    });
  },
  printTask: function (task, type) {
    let additionalData = `<div id="additionalData">`;
    userData = localData.getUserData();
    switch (type) {
      case "all": {
        if (
          userData.trackedTasks.includes(task.id) &&
          !userData.completedTasks.includes(task.id)
        ) {
          additionalData += `
            <button type="button" class="remove" onclick="appFunctions.removeTrackedTask('${task.id}','all')">
              <img src="/assets/img/taskTrackedIcon.png" alt="" class="taskTrackedIcon">
            </button>
          `;
        } else if (userData.completedTasks.includes(task.id)) {
          additionalData += `
            <button type="button" class="completed" onclick="interface.printAlert('Task is already completed, you can view it in the complted tasks list')">    
              <img src="/assets/img/taskCompletedIcon.png" alt="" class="taskCompletedIcon">
            </button>
          `;
        } else {
          additionalData += `
            <button type="button" class="track" onclick="appFunctions.trackTask('${task.id}','all')"> 
              <img src="/assets/img/trackTaskIcon.png" alt="" class="trackTaskIcon">
            </button>
          `;
        }
        break;
      }
      case "tracked": {
        additionalData += `             
            <div id="additionalData">
                <button type="button" class="remove" onclick="appFunctions.removeTrackedTask('${task.id}','tracked')">
                  <img src="/assets/img/deleteIcon.png" alt="" class="deleteIcon">
                </button>

                <button type="button" class="markAsCompleted" onclick="appFunctions.markAsCompleted('${task.id}')">    
                  <img src="/assets/img/markAsCompletedIcon.png" alt="" class="markAsCompleteIcon">
                </button>
        `;
        break;
      }
      case "removedTracks": {
        additionalData += `
              <button type="button" class="track" onclick="appFunctions.trackTask('${task.id}','removed')">
                <img src="/assets/img/trackTaskIcon.png" alt="" class="trackTaskIcon">
              </button>
        `;
        break;
      }
      case "delete": {
        if (userData.roles.includes("admin")) {
          additionalData += `      
            <button type="button" class="delete" onclick="appFunctions.deleteTask('${task.id}')">    
              <img src="/assets/img/deleteIcon.png" alt="" class="deleteIcon">
            </button>
          `;
        }
      }
    }
    additionalData += `</div>`;
    dataDiv.innerHTML += `
        <div class="task-item col-11 col-md-5 mx-auto">
          <p class="title">${task.name}</p>
          <p class="ig small">${task.ig}</p>
          <p class="karma">${task.karma}</p>
          <p class="hashtag small">${task.hashtag}</p>
          <p class="totalPeopleCurrentlyTracking">
          <img src="/assets/img/taskTrackedIcon.png" alt="" class="taskTrackedIcon">
            <span class="txt">${task.totalPeopleCurrentlyTracking}</span>         
          </p>
          <p class="totalPeopleCompleted">
            <img src="/assets/img/taskCompletedIcon.png" alt="" class="taskTrackedIcon">
            <span class="txt">${task.totalPeopleCompleted}</span>   
          </p>         

          ${additionalData}
        </div>       
      `;
  },
  printTaskDetails: function () {
    interface.clearDataDiv();
  },
  printAllTasks: function () {
    interface.clearDataDiv();
    var tasks = localData.getTasks(tasks);
    //console.log("All tasks | ", tasks);
    if (tasks.length == 0) {
      this.printAlert(`No tasks Available`);
      //console.log("No tasks Available");
    } else {
      for (x in tasks) {
        interface.printTask(tasks[x], "all");
      }
    }
  },
  printTrackedTasks: function () {
    interface.clearDataDiv();
    let trackedTasks = localData.getUserData().trackedTasks;

    if (trackedTasks.length == 0) {
      this.printAlert("You don't have any track history");
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
    interface.clearDataDiv();
    let userData = localData.getUserData();
    if (userData.removedTracks.length == 0) {
      this.printAlert(`You don't have any removed trackings`);
    } else {
      for (x in userData.removedTracks) {
        interface.printTask(
          appFunctions.getTaskById(userData.removedTracks[x]),
          "removedTracks"
        );
      }
    }
  },
  printCompletedTasks: function () {
    interface.clearDataDiv();
    let userData = localData.getUserData();
    if (userData.completedTasks.length <= 0) {
      this.printAlert("You dont have any completed tasks");
    }
    for (x in userData.completedTasks) {
      this.printTask(
        appFunctions.getTaskById(userData.completedTasks[x]),
        "completed"
      );
    }
  },
  deleteTasks: function () {
    interface.clearDataDiv();
    let tasks = localData.getTasks();
    if (tasks.length <= 0) {
      interface.printAlert(
        "No Tasks Exists! If this is an error or a bug, contact support team."
      );
    }
    for (x in tasks) {
      this.printTask(tasks[x], "delete");
    }
  },
  searchTask: function () {
    searchDiv = this.createSearchDiv();
    searchDiv.innerHTML = "Search div";
    searchDiv.innerHTML = `
      <input
      type="text"
      class="searchBox"
      id="searchBox"
      placeholder="Enter Something"/>
    `;
    searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("input", function () {
      appFunctions.searchTask(searchBox.value);
    });
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  interface.initializeDivs();
  localData.initializeLocalStorage();
}
// console.log(localData.getUserData());

//----------------------------------------------------------------------------------------
main();
// localStorage.removeItem("userData");

// I want to implement something like window.confirm but with bootstrap modal. When the delete button is clicked deleteTask(id) function like below function deleteTask(id){
//   if(interface.confirm){
//     //delete task code
//   }
// }

// the interface.confirm opens the modal with confirm and delcine buttons . If confirm is pressed the function returns 1 if decline is pressed it return 0 to the deleteTask() function. How to implement it