var dashboard = document.getElementById("dashboard");

function setDashboard() {
  window.addEventListener("storage", function (event) {
    console.log("Storage event triggered");
    if (event.key == "userData") {
      console.log("Change in userdata");
    }
  });
  if (localData.getUserData()) {
    dashboard.innerHTML = `
    <div class="w-fit mx-auto">
      <h1
        class="dashboardTitle d-block mx-auto px-3 display-1 fw-100 m-3 mb-4 text-secondary border-end"
      >
        Dashboard
      </h1>
      </div>
      
      <div class="userStats col-md-7 mx-auto">
      <div class="userStatsItem">
        <img
          src="/assets/img/taskTrackedIcon.png"
          alt=""
          class="userStatsIcon"
        />
        <p class="">${userData.totalTracking}</p>
      </div>
  
      <div class="userStatsItem">
        <img
          src="/assets/img/taskCompletedIcon.png"
          alt=""
          class="userStatsIcon"
        />
        <p class="">${userData.completedTasks.length}</p>
      </div>
  
      <div class="userStatsItem">
        <img
          src="/assets/img/karma.svg"
          alt=""
          class="userStatsIcon"
        />
        <p class="">${userData.totalKarma}</p>
      </div>
    </div>
    <hr class="profileHr" />
  `;
  } else {
    dashboard.innerHTML = `
      <h1
        class="dashboardTitle d-block mx-auto px-3 display-1 fw-100 m-3 mb-4 text-secondary border-end"
      >
        Dashboard
      </h1>
      <p class="small px-3">Seems like you are new here. Please <a class="link-info warning" onclick="appFunctions.localSignUp()"> Setup User Profile</a> and Continue</p>
      <hr class="profileHr" />
    `;
  }
  if (localData.getUserData() && userData.roles.includes("admin")) {
    dashBoardItems.innerHTML += `        
        <button class="btn col-12 col-md-4 mx-md-5 dashboard-button" type="button" onclick="interface.addTaskForm()">
        Add mulearn Discord Tasks </button>
        <button class="btn col-12 col-md-4 mx-md-5  dashboard-button" type="button" onclick="interface.deleteTasks()"> Delete mulearn Discord Tasks </button>
        <button class="btn col-12 col-md-4 mx-md-5  dashboard-button" type="button" onclick="interface.addChannelForm()"> Add Channel</button>
        <button class="btn col-12 col-md-4 mx-md-5  dashboard-button" type="button" onclick="interface.printChannels()"> View/Delete Channels</button>
    `;
  }
}

function dashboardMain() {
  setDashboard();
}
dashboardMain();
