var userId = document.getElementById("userId"),
  displayName = document.getElementById("name"),
  username = document.getElementById("username"),
  dashBoardItems = document.getElementById("dashBoardItems");

function setDashboard() {
  userId.innerHTML = `ID: ${userData.userId}`;
  displayName.innerHTML = `${userData.name}`;
  username.innerHTML = `@${userData.userName}`;
  if (userData.roles.includes("admin")) {
    dashBoardItems.innerHTML += `        
        <button class="btn col-12 col-md-4 mx-md-5 dashboard-button" type="button" onclick="interface.addTaskForm()">
        Add mulearn Discord Tasks </button>
        <button class="btn col-12 col-md-4 mx-md-5  dashboard-button" type="button" onclick="interface.deleteTasks()"> Delete mulearn Discord Tasks </button>
    `;
  }
}

function main() {
  setDashboard();
}

main();
console.log(localData.getUserData());
