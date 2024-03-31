// initalising tooltips
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// Global variables
var condition = false,
  temp,
  dataDivContainer,
  dataDiv,
  searchDiv,
  searchBox,
  modalDiv,
  modalTitle,
  modalBody,
  modalBtn,
  modalCloseBtn,
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

var basicData = {
  // Used to manage important data
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
  // Used to manage user data
  profilePic: "",
  name: "Beta User",
  userName: "beta",
  userId: "nx2jf9m49wm",
  totalTracking: 0,
  removedTracks: [],
  trackedTasks: [],
  completedTasks: [],
  roles: ["superAdmin", "moderator", "user"],
  totalKarma: 0,
};

var localData = {
  /*
    Things in local Storage
    1. userData : To store userdata
    2. tasks : To store tasks.
  */

  initializeLocalStorage: function () {
    if (!this.getUserData()) {
      this.putUserData(userData);
      cloud.incrementLocalUserCount();
    } else {
      userData = this.getUserData();
    }
    cloud.getAllTasksFromDB();
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

var appFunctions = {
  generateTaskId: async function () {
    let basicData;
    //console.log("Generating Task ID");
    await cloud.getBasicData().then((res) => {
      basicData = res;
    });
    basicData.lastTaskId -= Math.random() * 169;
    console.log(basicData);
    return basicData.lastTaskId.toString(36).toUpperCase();
  },
  addTask: async function () {
    //console.log("Add task Trigered");

    let task = {
      id: "",
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
    await appFunctions.generateTaskId().then((res) => {
      task.id = res;
    });
    if (this.validateForm(task, "addTask") == true) {
      task.trackTask = 0;
      task.totalPeopleCompleted = 0;
      task.totalPeopleCurrentlyTracking = 0;
      task.reviews = [];
      console.log(task);
      //console.log("Task ID is :", task.id);
      let tasks = localData.getTasks();
      await cloud.saveTaskToDB(task);
      await cloud.getAllTasksFromDB();
      interface.printAlert(
        `Task Added successfully. <button class="alertLink btn btn-light" onclick="interface.printAllTasks()">View</button>`
      );
      interface.addTaskForm();
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
            `Some required fields are not filled.<br> Empty fields are: ${emptyFields}. If all fields are filled and you think this is an error contact support! `
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
        let task = appFunctions.getTaskById(id);
        task.totalPeopleTracked++;
        task.totalPeopleCurrentlyTracking++;
        cloud.updateTaskInDB(task);
        await cloud.getAllTasksFromDB();
        userData.totalTracking++;
      }
      if (appFunctions.validateTracking(userData.removedTracks, id)) {
        userData.removedTracks.splice(userData.removedTracks.indexOf(id), 1);
      }
      localData.putUserData(userData);
      interface.printAlert(
        `Task tracked successfully <button class="alertLink" onclick="interface.printTrackedTasks()">View</button>`
      );
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
      console.log("Condition true");
      let userData = localData.getUserData();
      let trackedTasks = userData.trackedTasks;
      let task = appFunctions.getTaskById(id);
      task.totalPeopleCurrentlyTracking--;
      await cloud.updateTaskInDB(task);
      for (x in trackedTasks) {
        let task = appFunctions.getTaskById(trackedTasks[x]);
        if (task.id == id) {
          //console.log("Task Found");
          userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
          userData.totalTracking--;
          userData.removedTracks.push(id);
          localData.putUserData(userData);
          interface.printAlert(
            `Task Removed successfully.     <button class="alertLink" onclick="interface.printRemovedTracks()">View</button>`
          );
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
      await cloud.deleteTask(id);
      if (userData.trackedTasks.includes(id)) {
        //console.log("Task found in trackedTasks");
        userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
      }
      if (userData.removedTracks.includes(id)) {
        //console.log("Task found in removedTracks");
        userData.removedTracks.splice(userData.removedTracks.indexOf(id), 1);
      }
      if (userData.completedTasks.includes(id)) {
        userData.completedTasks.splice(userData.completedTasks.indexOf(id), 1);
        userData.totalKarma -= +appFunctions.getTaskById(id).karma;
      }
      localData.putUserData(userData);
      interface.printAlert(
        `Task and all its assosciated data deleted successfully`
      );
      interface.deleteTasks();
    }
  },
  markAsCompleted: async function (id) {
    console.log("marking task as completed");
    let condition = await interface.confirmActionModal(
      "Once you mark it as completed, you cannot track or schedule it again. DO NOT click OK if you are not sure about it!"
    );
    if (condition) {
      let userData = localData.getUserData();
      let task = appFunctions.getTaskById(id);
      userData.completedTasks.push(id);
      userData.trackedTasks.splice(userData.trackedTasks.indexOf(id), 1);
      task.totalPeopleCurrentlyTracking--;
      task.totalPeopleCompleted++;
      userData.totalKarma += +this.getTaskById(id).karma;
      localData.putUserData(userData);
      await cloud.updateTaskInDB(task);
      interface.printAlert(`Task successfully   marked as complete
      <button class="alertLink" onclick="interface.printCompletedTasks()">View</button>`);
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
    let searchResults = [];
    let tasks = localData.getTasks();
    for (x in tasks) {
      if (tasks[x].description.includes(searchTerm)) {
        console.log("itemFound");
        searchResults.push(tasks[x]);
      }
    }
    interface.clearDataDiv();
    for (x in searchResults) {
      interface.printTask(searchResults[x]);
    }
  },
};

var interface = {
  initializeDivs: function () {
    this.createDataDiv();
    this.createAlertDiv();
    this.createModalDiv();
  },
  createDataDiv: function () {
    let div = document.createElement("div");
    div.id = "dataDivContainer";
    document.body.appendChild(div);
    dataDivContainer = document.getElementById("dataDivContainer");
    dataDivContainer.innerHTML = `
      <div class="header">
        <button class="close" onclick="interface.hideDataDivContainer()">Go Back</button>
      </div>
      <div class="" id="searchDiv">
        <div class="search">
          <input type="text" id="searchBox" placeholder="Search Something" />
        </div>
      </div>
      <div class="" id="dataDiv"></div>
    `;
    dataDiv = document.getElementById("dataDiv");
    searchDiv = document.getElementById("searchDiv");
    searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("input", function () {
      appFunctions.searchTask(searchBox.value);
    });
    interface.hideDataDivContainer();
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
                id="closeModal" 
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
    modalCloseBtn = document.getElementById("closeModal");
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

      modalCloseBtn.addEventListener("click", function () {
        resolve(false);
      });
    });
    return confirmAction;
  },
  showDataDivContainer: function () {
    dataDivContainer.style.display = "block";
  },
  hideDataDivContainer: function () {
    dataDivContainer.style.display = "none";
    this.hideSearchDiv();
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
  addChannelForm: function () {
    this.showDataDivContainer();
    dataDiv.innerHTML = `
      <div class="addChannelForm">
        <input type="text" placeholder="Channel Name" id="channelName"/>
        <input type="text" placeholder="Channel Id" id="channelId"/>
        <button type="button" id="submitChannelBtn">Add Channel</button>
      </div>
    `;
    let submitBtn = document.getElementById("submitChannelBtn");
    let channelname = document.getElementById("channelName");
    let channelId = document.getElementById("channelId");
    submitBtn.addEventListener("click", function () {
      // values passed to cloud are channel name, and the extracted channel id from the channel link
      cloud.createChannel(channelname.value, channelId.value);
      interface.hideDataDivContainer();
    });
  },
  printChannels: async function () {
    let channels = await cloud.getAllChannels();
    this.clearDataDiv();
    let content = `
      <div class="channelContainer d-flex flex-row justify-content-center align-items-center flex-wrap">
    `;
    for (x in channels) {
      content += `
        <div class="channelItem col-11 col-md-4 m-2">
          <p class="channelName d-inline p-2">${channels[x].name}</p>
          <p class="cid d-inline p-2">${channels[x].id}</p>
          <button class="delete btn btn-danger px-4 py-1" onclick="cloud.deleteChannel('${channels[x].id}')">Dlt</button>
        </div>
      `;
    }
    content += `</div>`;
    dataDiv.innerHTML = content;
    this.showDataDivContainer();
  },
  taskForm: async function () {
    interface.showDataDivContainer();
    let data = await cloud.getBasicData();
    interestGroups = data.interestGroups;
    let igOptions = `<option class="" value="">Select Interest Group</option>`;
    for (x in interestGroups) {
      // console.log("adding igOptions");
      igOptions += `
        <option class="" value="${interestGroups[x].code}">${interestGroups[x].name}</option>
      `;
    }
    dataDiv.innerHTML = `
      <form class="col-md-8 mx-auto">
        <input id="taskName" type="text" class="" placeholder="Title(name)" required>
        <input id="hashtag" type="text" class="" placeholder="Hashtag" required>
        <select name="interestGroups" id="ig">${igOptions}</select>
        <textarea id="description" type="text" class="" placeholder="Task Description"></textarea>
        <input id="taskLink" type="text" class="" placeholder="Link to task">
        <input id="karma" type="text" class="" placeholder="Karma Points" required>
        <input id="taskChannel" type="text" class="" placeholder="Channel which defines this task">
        <input id="submissionChannel" type="text" class="" placeholder="Channel to submit task">
        <button id="submitBtn" type="button">Add Task</button>
      </form>
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
      return true;
    });
  },
  addTaskForm: async function () {
    //console.log("Add task UI Printed");
    await interface.taskForm();
    submitBtn.addEventListener("click", function () {
      appFunctions.addTask();
    });
  },
  printTask: function (task, type) {
    interface.showDataDivContainer();
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
        <div  onclick="interface.viewTaskItem('${task.id}')">
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
        </div>             
        ${additionalData}
        </div>       
      `;
  },
  viewTaskItem: function (id) {
    console.log(`Printing item ${id}`);
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
  hideSearchDiv: function (searchTerm) {
    searchDiv.style.display = "none";
  },
  showSearchDiv: function (searchTerm) {
    searchDiv.style.display = "block";
    interface.printAllTasks();
    this.showDataDivContainer();
  },
  localUserSetUp: function () {
    dataDiv.innerHTML = `
      <div class="localUserSignUp w-fit mx-auto">
        <p class="text-secondary px-2 px-md-5">Seems Like you are new here, Let's sign you Up</p>
        <p class="display-4 text-center fw-100 mt-5 mb-3">Setup User Profile</p>
        <input type="text" class="fs-5 d-block d-md-inline mx-auto p-2" placeholder="Enter your Name">
        <button class="btn btn-outline-success px-5 py-1 m-3 d-block d-md-inline mx-auto mx-md-4" onclick="">Sign Up</button>
      </div>
    `;
    this.showDataDivContainer();
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await initializeFirebase();
  interface.initializeDivs();
  localData.initializeLocalStorage();
}

// console.log(localData.getUserData());

//----------------------------------------------------------------------------------------
main();
// localStorage.removeItem("userData");
