/**
 * @file Welcome to the codebase of mu-companion. This is the main script file for the mu-companion web app. ALong with this app.js, there is a firebasescript.js file, which deals with all firebase fireastore relted functions.
 * @version 1.5.0
 * @author Christo John <https://www.github.com/christo-zero-john>
 * 

 */

// Global variables
var condition = false,
  dataWrapper,
  dataHeader,
  dataDiv,
  searchBox,
  modalDiv,
  modalTitle,
  modalBody,
  modalBtn,
  modalCloseBtn,
  toastBody,
  taskForm,
  getName,
  getHashtag,
  getIg,
  getDescription,
  getLink,
  getKarma,
  getTaskChannel,
  getSubmissionChannel,
  submitBtn;

var basicData = {};

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
  roles: ["user"],
  totalKarma: 0,
};

var localData = {
  /*
    Things in local Storage
    1. userData : To store userdata
    2. tasks : To store tasks.
    3. Basicdata
  */

  initializeLocalStorage: async function () {
    if (!this.getUserData()) {
      this.putUserData(userData);
      cloud.incrementLocalUserCount();
    } else {
      userData = this.getUserData();
    }
    await cloud.getAllTasksFromDB();
    await cloud.getBasicData();
    return new Promise((resolve) => {
      resolve(1);
    });
  },
  clearLocalStorage: function () {
    localStorage.removeItem("userData");
  },
  getTasks: function () {
    // function to retrieve all tasks from localStorage
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
  getBasicData: function () {
    return JSON.parse(localStorage.getItem("basicData"));
  },
  putBasicData: function (data) {
    localStorage.setItem("basicData", JSON.stringify(data));
  },
};

var appFunctions = {
  generateTaskId: async function () {
    let basicData;
    console.log("Generating Task ID");
    await cloud.getBasicData().then((res) => {
      basicData = res;
    });
    console.log("BasicData captured", basicData);
    basicData.lastTaskId -= Math.random() * 169 + 1;
    console.log("Task ID Generated", basicData.lastTaskId);
    cloud.updatePropertyOfBasicData("lastTaskId", basicData.lastTaskId);
    return basicData.lastTaskId.toString(36).toUpperCase();
  },
  addTask: async function () {
    console.log("Processing input task");
    let task = {
      id: getHashtag.value,
      level: "",
      name: getName.value,
      hashtag: getHashtag.value,
      ig: getIg.value == "" ? "none" : getIg.value,
      description:
        getDescription.value == "" ? getName.value : getDescription.value,
      karma: getKarma.value,
      taskChannel: getTaskChannel.value == "" ? "none" : getTaskChannel.value,
      submissionChannel:
        getSubmissionChannel.value == "" ? "none" : getSubmissionChannel.value,
      link: document.getElementById("taskLink").value,
    };
    if (task.taskChannel.includes("lvl1")) {
      task.level = 1;
    } else if (task.taskChannel.includes("lvl2")) {
      task.level = 2;
    } else if (task.taskChannel.includes("lvl3")) {
      task.level = 3;
    } else if (task.taskChannel.includes("lvl4")) {
      task.level = 4;
    } else if (task.taskChannel.includes("lvl5")) {
      task.level = 5;
    } else if (task.taskChannel.includes("lvl6")) {
      task.level = 6;
    } else if (task.taskChannel.includes("lvl7")) {
      task.level = 7;
    } else if (task.taskChannel.includes("info")) {
      let cname = task.taskChannel;
      cname = cname.split("-");
      task.level = cname[1];
      console.log("task level ", task.level);
    } else {
      task.level = 0;
    }
    if (this.validateForm(task, "addTask") == true) {
      task.trackTask = 0;
      task.totalPeopleCompleted = 0;
      task.totalPeopleCurrentlyTracking = 0;
      task.reviews = [];
      console.log(task);
      // console.log("Task ID is :", task.id);
      await cloud.saveTaskToDB(task);
      await cloud.getAllTasksFromDB();
      interface.printAlert(
        `Task Added successfully. <button class="alertBtn btn btn-info d-inline p-0 px-3 btn btn-light" onclick="interface.printAllTasks()">View</button>`
      );
      interface.clearTaskForm();
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
    console.log("Tracktask triggered", id);
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
        task.totalPeopleCurrentlyTracking++;
        await cloud.updateTaskInDB(task);
      }
      if (appFunctions.validateTracking(userData.removedTracks, id)) {
        userData.removedTracks.splice(userData.removedTracks.indexOf(id), 1);
      }
      localData.putUserData(userData);
      interface.printAlert(
        `Task tracked successfully <button class="alertBtn btn btn-info d-inline p-0 px-3" onclick="interface.printTrackedTasks()">View</button>`
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
          userData.removedTracks.push(id);
          localData.putUserData(userData);
          interface.printAlert(
            `Task Removed successfully.     <button class="alertBtn btn btn-info d-inline p-0 px-3" onclick="interface.printRemovedTracks()">View</button>`
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
      "Mark as Completed",
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
      <button class="alertBtn btn btn-info d-inline p-0 px-3" onclick="interface.printCompletedTasks()">View</button>`);
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
    // console.log(searchTerm);
    let searchResults = [];
    let tasks = localData.getTasks();
    for (x in tasks) {
      if (tasks[x].description.includes(searchTerm)) {
        console.log("itemFound");
        searchResults.push(tasks[x]);
      }
    }
    interface.clearDataDiv();
    dataDiv.innerHTML = `Tasks found:${searchResults.length}`;
    for (x in searchResults) {
      interface.printTask(searchResults[x], "all");
    }
  },
};

var interface = {
  setDashboard: async function () {
    let dashboard = document.getElementById("dashboard");
    let dashboardTasks = document.getElementById("dashboardTasks");
    let menuItems = document.getElementById("menu-items");
    if (userData.roles.includes("admin")) {
      let data = await cloud.getBasicData();
      data = {
        localUserCount: data.localUserCount,
        registeredUserCount: data.registeredUserCount,
      };
      data = JSON.stringify(data);
      menuItems.innerHTML += `
        <p class="normal-link" onclick='interface.adminDashboard(${data})'>Admin Dashboard</p>
      `;
    }
    dashboard.innerHTML = `
    <div>
      <img src="/assets/img/tracked-task-icon.svg" alt="" class="dashboard-icon">
      <p class="dashboard-score">${userData.trackedTasks.length}</p>
    </div>

    <div>
      <img src="/assets/img/completed-task-icon.svg" alt="" class="dashboard-icon">
      <p class="dashboard-score">${userData.completedTasks.length}</p>
    </div>

    <div>
      <img src="/assets/img/karma-points-icon.svg" alt="" class="dashboard-icon">
      <p class="dashboard-score">${userData.totalKarma}</p>
    </div>
  `;
    if (userData.trackedTasks.length > 0) {
      dashboardTasks.innerHTML = "";
      for (x in userData.trackedTasks) {
        dashboardTasks.innerHTML += `
        <p class="">${
          appFunctions.getTaskById(userData.trackedTasks[x]).name
        }</p>`;
      }
    }
    interface.hideLoading();
  },
  printBulkTask: function () {},
  adminDashboard: function (data) {
    this.showDataWrapper("Admin Dashboard");
    dataDiv.innerHTML = `
      <div
        class="admin-dashboard d-flex flex-row justify-content-around align-items-center"
      >
        <div class="">
          <img
            src="/assets/img/registered-users-icon.svg"
            alt="Registered Users"
            class="dashboard-icon"
          />
          <p class="dashboard-score">${data.registeredUserCount}</p>
        </div>

        <div class="">
          <img
            src="/assets/img/total-users-icon.svg"
            alt="Local users"
            class="dashboard-icon"
          />
          <p class="dashboard-score">${data.localUserCount}</p>
        </div>
      </div>

      <div class="admin-dashboard-menu">
        <p class="link normal-link" onclick="interface.addTaskForm()">
          Add mulearn Discord task
        </p>
        <!-- <p
          class="link normal-link"
          onclick=""
        >
          Delete mulearn Discord task
        </p> -->
        <p class="link normal-link" onclick="interface.addChannelForm()">Add Channel</p>
        <p class="link normal-link" onclick="interface.printChannels()">Show All Channel</p>
      </div>
    `;
  },
  initializeDivs: function () {
    this.createDataDiv();
    this.createAlertDiv();
    this.createModalDiv();
    this.setTaskForm();
  },
  createDataDiv: function () {
    let div = document.createElement("div");
    div.id = "data-wrapper";
    div.classList = "bg-dark no-scrollbar";
    document.body.appendChild(div);
    dataWrapper = document.getElementById("data-wrapper");
    dataWrapper.innerHTML = `
    <div class="header sticky-top bg-dark w-100 p-3 py-2">
      <div class="d-flex flex-row justify-content-between">
        <p class="fs-3 fw-100 d-inline" id="data-header">mu-companion</p>

        <img
          src="/assets/img/close-button.svg"
          alt="close button"
          class="menu-icon"
          onclick="interface.hideDataWrapper()"
        />
      </div>            
      <input type="text" id="search-box" placeholder="Search Something">
    </div>

  <div id="data-div">     
  </div>
    `;
    dataDiv = document.getElementById("data-div");
    dataHeader = document.getElementById("data-header");
    searchBox = document.getElementById("search-box");
    searchBox.addEventListener("input", function () {
      appFunctions.searchTask(searchBox.value);
    });
    interface.hideDataWrapper();
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
            <div class="modal-body bg-dark fw-100" id="modalBody"></div>
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
    let alertToast = `
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          class="toast bg-dark text-info fw-100 border border-info"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header bg-dark text-warning fw-100 border border-info">
            
            <strong class="me-auto">Message</strong>
            <button
              type="button"
              class="btn bg-secondary btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div class="p-2 text-light" id="toast-body">Hey, This is an alert</div>
        </div>
      </div>
    `;
    document.write(alertToast);
    toastBody = document.getElementById("toast-body");
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
  showDataWrapper: function (title) {
    dataWrapper.style.display = "block";
    if (title) {
      dataHeader.innerHTML = title;
    }
  },
  hideDataWrapper: function () {
    dataWrapper.style.display = "none";
    this.hidesearchBox();
  },
  setTaskForm: async function () {
    let data = localData.getBasicData();
    let interestGroups = data.interestGroups;
    let igOptions = `<option class="" value="">Select Interest Group</option>`;
    for (x in interestGroups) {
      // console.log("adding igOptions");
      igOptions += `
        <option class="" value="${interestGroups[x].code}">${interestGroups[x].name}</option>
      `;
    }
    document.write(
      `
      <form class="col-md-8 mx-auto" id="taskForm">
        <input id="taskName" type="text" class="" placeholder="Title(name)" >
        <input id="hashtag" type="text" class="" placeholder="Hashtag" >
        <select name="interestGroups" id="ig">${igOptions}</select>
        <textarea id="description" class="" placeholder="Task Description"></textarea>
        <input id="taskLink" type="text" class="" placeholder="Link to task">
        <input id="karma" type="text" class="" placeholder="Karma Points" >
        <input id="taskChannel" type="text" class="" placeholder="Channel which defines this task">
        <input id="submissionChannel" type="text" class="" placeholder="Channel to submit task">
        <button id="submitBtn" type="button">Add Task</button>
      </form>
    `
    );
    taskForm = document.getElementById("taskForm");
    interface.hideTaskForm();
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
  hideTaskForm: function () {
    taskForm.style.display = "none";
  },
  clearTaskForm: function () {
    getName.value = "";
    getHashtag.value = "";
    getDescription.value = "";
    getTaskLink.value = "";
    getKarma.value = "";
  },
  showTaskForm: function () {
    taskForm.style.display = "block";
    this.hideDataWrapper();
  },
  printAlert: async function (message) {
    toastBody.innerHTML = message;
    let toast = new bootstrap.Toast(document.getElementById("liveToast"));
    toast.show();
  },
  hideAlert: function () {
    alertDiv.innerHTML = "";
    alertDiv.style.display = "none";
  },
  clearDataDiv: function () {
    dataDiv.innerHTML = "";
  },
  addChannelForm: function () {
    this.showDataWrapper("Add Channel");
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
    this.showDataWrapper("All Available Channels");
  },
  addTaskForm: async function () {
    //console.log("Add task UI Printed");
    interface.showTaskForm();
    submitBtn.addEventListener("click", function () {
      appFunctions.addTask();
    });
  },
  printTask: function (task, type) {
    let buttons = `<div class="buttons" id="buttons" onclick="">`;
    userData = localData.getUserData();
    switch (type) {
      case "all": {
        if (
          userData.trackedTasks.includes(task.id) &&
          !userData.completedTasks.includes(task.id)
        ) {
          buttons += `
            <button
              class="btn"
              onclick="appFunctions.removeTrackedTask('${task.id}','all')"
            >
              <img src="/assets/img/tracked-task-icon.svg" alt="remove task" class="" />
            </button>
          `;
        } else if (userData.completedTasks.includes(task.id)) {
          buttons += `
            <button
              class="btn"
              onclick="interface.printAlert('Task is already completed, you can view it in the complted tasks list')"
            >
              <img src="/assets/img/completed-task-icon.svg" alt="completed task" class="" />
            </button>
          `;
        } else {
          buttons += `
            <button
              class="btn"
              onclick="appFunctions.trackTask('${task.id}','all')"
            >
              <img src="/assets/img/track-task-icon.svg" alt="track this task" class="" />
            </button>
          `;
        }
        break;
      }
      case "tracked": {
        buttons += `             
          <button
            class="btn"
            onclick="appFunctions.removeTrackedTask('${task.id}','tracked')"
          >
            <img src="/assets/img/delete-icon.svg" alt="Remove Task" class="" />
          </button>

          <button
            class="btn"
            onclick="appFunctions.markAsCompleted('${task.id}')"
          >
            <img
              src="/assets/img/mark-task-completed-icon.svg"
              alt="Mark this task as completed"
              class=""
            />
          </button>
        `;
        break;
      }
      case "removedTracks": {
        buttons += `
          <button
            class="btn"
            onclick="appFunctions.trackTask('${task.id}','removed')"
          >
            <img
              src="/assets/img/track-task-icon.svg"
              alt="Track Task"
              class=""
            />
          </button>
        `;
        break;
      }
      case "delete": {
        if (userData.roles.includes("admin")) {
          buttons += `      
            <button class="btn" onclick="appFunctions.deleteTask('${task.id}')">
              <img src="/assets/img/delete-icon.svg" alt="Remove Task" class="" />
            </button>
          `;
        }
      }
    }
    buttons += `</div>`;
    dataDiv.innerHTML += `
      <div class="task-item-wrap col-12 col-md-5 mb-1 m-md-2 mx-auto p-2">
        <div class="task-item" onclick="interface.viewTask('${task.id}')">
          <div class="">
            <p class="name">${task.name}</p>
            <p class="ig">${task.ig}</p>
          </div>
          <p class="hashtag">${task.hashtag}</p>

          <div class="total-trackings">
            <img
              src="/assets/img/tracked-task-icon.svg"
              alt=""
              class="task-stat-img"
            />
            <p class="task-stat-text">${task.totalPeopleCurrentlyTracking}</p>
          </div>

          <div class="total-completions">
            <img
              src="/assets/img/completed-task-icon.svg"
              alt=""
              class="task-stat-img"
            />
            <p class="task-stat-text">${task.totalPeopleCompleted}</p>
          </div>

          <p class="karma-points">${task.karma}</p>  
        </div>     
        ${buttons}
      </div>       
      `;
  },
  viewTask: function (id) {
    let task = appFunctions.getTaskById(id);
    let button = "";
    console.log(`Viewing Task ${id}`);
    this.showDataWrapper(task.id);
    if (userData.trackedTasks.includes(task.id)) {
      button = `
          <div class="task-stat d-inline text-nowrap task-expand-btn" onclick="appFunctions.removeTrackedTask('${task.id}', 'expand')">
            <img src="/assets/img/tracked-task-icon.svg" alt="" class="task-stat-img">
            <button class="btn text-light p-2 d-inline task-stat-text ">Remove from task list</button>
        </div>
      `;
    } else if (userData.completedTasks.includes(task.id)) {
      button = `
          <div class="task-stat d-inline text-nowrap task-expand-btn">
            <img src="/assets/img/completed-task-icon.svg" alt="" class="task-stat-img">
            <button class="btn text-light p-2 d-inline task-stat-text">Task Already Completed</button>
        </div>
      `;
    } else {
      button = `
        <div class="text-center my-4">
          <div class="task-stat d-inline text-nowrap task-expand-btn" onclick="appFunctions.trackTask('${task.id}', 'expand')">
            <img src="/assets/img/tracked-task-icon.svg" alt="" class="task-stat-img">
            <button class="btn text-light p-2 d-inline task-stat-text ">Track Task</button>
        </div>
      `;
    }

    dataDiv.innerHTML = `
      <div class="task-item-wrap col-12 col-md-5 mb-1 m-md-2 mx-auto p-2 bg-transparent">
        <div class="task-item bg-transparent">
          <div class="">
            <p class="name">${task.name}</p>
            <p class="ig">${task.ig}</p>
          </div>
          <p class="hashtag">${task.hashtag}</p>
          <div class="total-trackings">
            <img
              src="/assets/img/tracked-task-icon.svg"
              alt=""
              class="task-stat-img"
            />
            <p class="task-stat-text">${task.totalPeopleCurrentlyTracking}</p>
          </div>

          <div class="total-completions">
            <img
              src="/assets/img/completed-task-icon.svg"
              alt=""
              class="task-stat-img"
            />
            <p class="task-stat-text">${task.totalPeopleCompleted}</p>
          </div>

          <p class="karma-points">${task.karma}</p> 

          <div class="my-4">
            ${button}
            <div class="task-stat d-inline text-nowrap task-expand-btn" onclick="window.location.href='${task.link}'">
                <img src="/assets/img/view-on-discord-icon.svg" alt="" class="task-stat-img">
                <button class="btn text-light p-2 d-inline task-stat-text">View on Discord</button>
            </div>

            <div class="task-stat d-inline text-nowrap task-expand-btn">
              <img src="/assets/img/post-task-on-discord-icon.svg" alt="" class="task-stat-img">
              <button class="btn text-light p-2 d-inline task-stat-text ">Post in  ${task.submissionChannel}</button>
            </div>
          </div>

          <p class="desc fw-100 p-2 p-md-4">${task.description}
          </p>
        </div>
      </div>  
    `;
  },
  printAllTasks: function () {
    interface.clearDataDiv();
    interface.showDataWrapper("All mulearn Tasks");
    var tasks = localData.getTasks(tasks);
    //console.log("All tasks | ", tasks);
    dataDiv.innerHTML = `<p class="p-2 small">Tasks found: ${tasks.length}</p>`;
    if (tasks.length == 0) {
      this.printAlert(
        `Fetch Tasks : Failed! Check your internet connection and try again.`
      );
      cloud.getAllTasksFromDB();
    } else {
      for (x in tasks) {
        interface.printTask(tasks[x], "all");
      }
    }
  },
  printTrackedTasks: function () {
    interface.clearDataDiv();
    interface.showDataWrapper("Your Tasks");
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
    interface.showDataWrapper("Removed Tasks");
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
    interface.showDataWrapper("Completed Tasks");
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
    interface.showDataWrapper("Delete Tasks");
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
  hidesearchBox: function () {
    searchBox.style.display = "none";
  },
  findTask: function () {
    searchBox.style.display = "block";
    interface.printAllTasks();
    interface.showDataWrapper("Find Tasks");
  },
  showLoading: function () {
    document.getElementById("loading-div").style.display = "block";
  },
  hideLoading: function () {
    document.getElementById("loading-div").style.display = "none";
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
    this.showDataWrapper();
  },
  guide: function () {
    this.showDataWrapper();
    dataDiv.innerHTML = `
      <div class="walkthrough p-3 fw-100 text-start">
        <h1 class="text-center">Getting Started with mu-companion</h1>
        <p class="">
          Welcome to mu-companion. In this walkthrough, we will be seeing about
          some of the important features of mu-companion webapp.
        </p>

        <p class="fs-4 fw-500">
          List of all icons in mu-companion and what they stands for
        </p>

        <table class="table table-dark border-dark wd-90 mx-auto">
          <tr class="">
            <td><img src="/assets/img/nav-icon.svg" alt="" class="icons" /></td>
            <td class="">Nav Icon: Shows navbar and more options.</td>
          </tr>
          <tr class="">
            <td>
              <img src="/assets/img/all-tasks-icon.svg" alt="" class="icons" />
            </td>
            <td class="">
              All tasks icon: Shows all available tasks synced with the app.
            </td>
          </tr>
          <tr class="">
            <td>
              <img src="/assets/img/find-task-icon.svg" alt="" class="icons" />
            </td>
            <td class="">Find Task Icon: Search for a task.</td>
          </tr>
          <tr class="">
            <td>
              <img src="/assets/img/tracked-task-icon.svg" alt="" class="icons" />
            </td>
            <td class="">
              Tracked Tasks Icon: Shows all tasks, a user have added to their
              tasks list.
            </td>
          </tr>
          <tr class="">
            <td>
              <img
                src="/assets/img/completed-task-icon.svg"
                alt=""
                class="icons"
              />
            </td>
            <td class="">
              Completed Tasks icon: Shows list of all tasks a user have marked as
              completed.
            </td>
          </tr>
          <tr class="">
            <td><img src="/assets/img/github.svg" alt="" class="icons" /></td>
            <td class="">
              Github icon: Star the mu-compnaion project on Github, or view code
              of this app.
            </td>
          </tr>
          <tr class="">
            <td>
              <img src="/assets/img/karma-points-icon.svg" alt="" class="icons" />
            </td>
            <td class="">
              Karma points: Shows your total karma points. It is the sum of karma
              points of all tasks a user have marked a s completed.
            </td>
          </tr>
          <tr class="">
            <td>
              <img
                src="/assets/img/mark-task-completed-icon.svg"
                alt=""
                class="icons"
              />
            </td>
            <td class="">
              Mark Task as completed Icon: Mark a task as completed.
            </td>
          </tr>
          <tr class="">
            <td>
              <img src="/assets/img/delete-icon.svg" alt="" class="icons" />
            </td>
            <td class="">Remove task Icon: Remove a task from the list.</td>
          </tr>
          <tr class="">
            <td>
              <img
                src="/assets/img/view-on-discord-icon.svg"
                alt=""
                class="icons"
              />
            </td>
            <td class="">
              View on discord icon: View a particular task in mulearn discord
              server.
            </td>
          </tr>
          <tr class="">
            <td>
              <img
                src="/assets/img/post-task-on-discord-icon.svg"
                alt=""
                class="icons"
              />
            </td>
            <td class="">
              Post task on discord: Post task on discord server. Redirects to the
              posting channel.
            </td>
          </tr>

          <tr class="">
            <td>
              <img src="/assets/img/close-button.svg" alt="" class="icons" />
            </td>
            <td class="">Close Icon: Close the interface.</td>
          </tr>

          <tr class="">
            <td>
              <img src="/assets/img/track-task-icon.svg" alt="" class="icons" />
            </td>
            <td class="">
              Track Task icon: Track a particular task / add to task list of a
              user.
            </td>
          </tr>
        </table>

        <section class="" id="walkthrough">
          <h2 class="text-center display-5 my-4">mu-companion Walkthrough</h2>
          <h3 class="fw-100 m-2 my-3">Operations Covered</h3>
          <ul class="">
            <li>
              <a href="#schedule" class="link-aquamarine text-decoration-none"
                >Schedule your first task</a
              >
            </li>
            <li>
              <a href="#viewlist" class="link-aquamarine text-decoration-none"
                >View your scheduled tasks</a
              >
            </li>
            <li>
              <a href="#removetask" class="link-aquamarine text-decoration-none"
                >Removing a task from your tasks list</a
              >
            </li>
            <li>
              <a href="#viewremoved" class="link-aquamarine text-decoration-none"
                >View Descheduled Task</a
              >
            </li>
            <li>
              <a
                href="#markcompleted"
                class="link-aquamarine text-decoration-none"
                >Mark a task as completed</a
              >
            </li>
            <li>
              <a
                href="#viewcompleted"
                class="link-aquamarine text-decoration-none"
                >View Completed tasks</a
              >
            </li>
          </ul>
          <p class="">
            In this Step By Step Walkthrough we are going to explore some basic
            features of this companion and how to use them.
          </p>

          <p class="">
            Before starting please open
            <a
              class="text-decoration-none link-greenyellow"
              href="/index.html"
              target="_blank"
              >dashboard</a
            >
            in a new tab and follow instructions from this tab while doing it in
            the new tab.
          </p>

          <p class="">
            After opening the dashboard, you could see your stats at the top just
            below the text Dashboard.
          </p>

          <!-- Schedule your first task -->
          <div class="" id="schedule">
            <h3 class="">Schedule your first task</h3>
            <p class="">
              The first thing we are going to do is to schedule your first task.
              For that click on the
              <img
                src="/assets/img/all-tasks-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon. Now you could see a long list of tasks. There find any tasks
              of your interest and click on the
              <img
                src="/assets/img/track-task-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon there. Now you'll get a confirmation message, click
              <code>Yes</code> to track that task. Tracking a task will add that
              task to your tasks list.
            </p>

            <p class="">
              Once you track a task, you could see the
              <img
                src="/assets/img/track-task-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon changed to
              <img
                src="/assets/img/tracked-task-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon. This icon represents that the task is already tracked. If you
              click on it a another message will pops up and if you click
              <code>yes</code>, the task will be removed from your tasks list.
            </p>
          </div>

          <!-- View your scheduled tasks -->
          <div class="" id="viewlist">
            <h3 class="">View your scheduled tasks</h3>
            <p class="">
              After scheduling tasks you could view those tasks in your Tasks
              List. Go back to your dashboard by clicking on the Click on the
              <img
                src="/assets/img/close-button.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              button and click on the
              <img
                src="/assets/img/tracked-task-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              icon in the dashboard, and you could see all the tasks you have
              currently tracked. After completing a task, you could mark it as
              completed by clicking on the
              <img
                src="/assets/img/mark-task-completed-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              icon in the <code>tracked tasks list</code>. If you want to remove
              that task from your tasks list, click on the
              <img
                src="/assets/img/delete-icon.svg"
                alt="remove task"
                class="appIcon"
              />
              icon assosciated with that task.
            </p>
          </div>

          <!-- Removing a task from your tasks list -->
          <div class="" id="removetask">
            <h3 class="">Removing a task from your tasks list</h3>
            <p class="">
              After scheduling some tasks you may start descheduling some tasks.
              To remove a task from your tasks list, click on
              <img
                src="/assets/img/tracked-task-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              option in the dashboard, and you could see all the tasks you have
              currently tracked. Now click on the
              <img
                src="/assets/img/delete-icon.svg"
                alt="remove task"
                class="appIcon"
              />
              icon of the task you want to deshedule/remove and you can see a
              confirmation message, clik <code>Yes</code> to remove that task from
              your tasks list.
            </p>
          </div>

          <!-- View Descheduled Task -->
          <div class="" id="viewremoved">
            <h3 class="">View Descheduled Task</h3>
            <p class="">
              Once you deshedule a task, it is moved to the Removed tasks List.
              You can see all descheduled tasks by clicking on the
              <img
                src="/assets/img/nav-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon in the dashboard and then clicking on the
              <code>Removed Tasks</code> option there. You can see the list of all
              tasks you have desheduled. If you want to schedule it again you
              could click on the
              <img
                src="/assets/img/track-task-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon of that task there. Click on the
              <img
                src="/assets/img/track-task-icon.svg"
                alt="track task"
                class="appIcon"
              />
              icon and it'll be moved to your tasks list.
            </p>
          </div>

          <!-- Mark a task as completed -->
          <div class="" id="markcompleted">
            <h3 class="">Mark a task as completed</h3>
            <p class="">
              After tracking a task, you could view it in the tracked tasks list.
              After completing it, you can mark that task as completed.
              <span class="bg-secondary p-1 text-dark"
                >Marking a task as completed is a permanent action and cannot undo
                it</span
              >. It is a one time action for each tasks. To mark a task as
              completed, first click on
              <img
                src="/assets/img/tracked-task-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              option in the dashboard and you could see all your tracked tasks.
              There click on the
              <img
                src="/assets/img/mark-task-completed-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              icon of a task and a confirmation message will appear, click on
              <code>Yes</code> and task will be mark as completed. After that the
              task will be removed from your tasks list and you could see it in
              the <code>Completed Tasks</code> list.
            </p>
          </div>

          <!-- View Completed tasks -->
          <div class="" id="viewcompleted">
            <h3 class="">View Completed tasks</h3>
            <p class="">
              To see all the completed tasks, click on the
              <img
                src="/assets/img/completed-task-icon.svg"
                alt="mark task as completed"
                class="appIcon"
              />
              icon in the dashboard and you could see all those tasks you have
              marked as completed. Once you mark a task as completed, it cannot be
              marked as incomplete again.
            </p>
          </div>
        </section>
      </div>
    `;
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await initializeFirebase();
  interface.initializeDivs();
  await localData.initializeLocalStorage();
  interface.setDashboard();
  // transferData();
}

// console.log(localData.getUserData());

//----------------------------------------------------------------------------------------
main();
// localStorage.removeItem("userData");
