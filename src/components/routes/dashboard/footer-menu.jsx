import React from "react";
import MenuActions from "../../../modules/User";

export default function FooterMenu() {
  return (
    <footer class="sticky-bottom menu d-flex flex-row justify-content-around align-items-center p-2">
      <a href="/tasks" className="">
        <img
          src="/src/assets/img/all-tasks-icon.svg"
          alt="View all tasks"
          class="menu-icon"
        />
      </a>

      <a href="/tasks?search-term=#">
        <img
          src="/src/assets/img/find-task-icon.svg"
          alt="Find tasks"
          class="menu-icon"
        />
      </a>

      <a href="/profile/tasks/todo">
        <img
          src="/src/assets/img/tracked-task-icon.svg"
          alt="View Tracked Tasks"
          class="menu-icon"
        />
      </a>

      <a href="/profile/tasks/completed">
        <img
          src="/src/assets/img/completed-task-icon.svg"
          alt="View completed Tasks"
          class="menu-icon"
        />
      </a>

      <a href="https://github.com/christo-zero-john/mu-companion-webapp">
        <img
          src="/src/assets/img/github.svg"
          alt="Goto Github repository"
          class="menu-icon"
        />
      </a>
    </footer>
  );
}
