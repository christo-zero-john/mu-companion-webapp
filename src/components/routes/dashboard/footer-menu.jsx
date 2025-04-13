import React from "react";

export default function FooterMenu() {
  return (
    <footer class="sticky-bottom menu d-flex flex-row justify-content-around align-items-center p-2">
      <img
        onClick={()=>MenuAcitions.printAllTasks()}
        src="/assets/img/all-tasks-icon.svg"
        alt="View all tasks"
        class="menu-icon"
      />

      <img
        onClick={()=>MenuAcitions.findTask()}
        src="/assets/img/find-task-icon.svg"
        alt="Find tasks"
        class="menu-icon"
      />

      <img
        onClick={()=>MenuAcitions.printTrackedTasks()}
        src="/assets/img/tracked-task-icon.svg"
        alt="View Tracked Tasks"
        class="menu-icon"
      />

      <img
        onClick={()=>MenuAcitions.printCompletedTasks()}
        src="/assets/img/completed-task-icon.svg"
        alt="View completed Tasks"
        class="menu-icon"
      />

      <a
        href="https://github.com/christo-zero-john/mu-companion-webapp"
      >
        <img
          src="/assets/img/github.svg"
          alt="Goto Github repository"
          class="menu-icon"
        />
      </a>
    </footer>
  );
}
