import { useEffect } from "react";
import { useState } from "react";

export default function CompletedTaskList() {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    setCompletedTasks([]);
  }, []);

  if (!completedTasks || completedTasks.length == 0) {
    return (
      <main class="dashboard-tasks mt-5">
        <h2 class="fs-4 fw-100 mx-3">Your Tasks</h2>
        <div class="fw-100 no-scrollbar ms-5 me-1 my-3" id="dashboardTasks">
          <p class="">Track some tasks to view them here.</p>
          <p class="fw-300">
            Click on
            <a href="/tasks" className="">
              <img
                src="/src/assets/img/all-tasks-icon.svg"
                alt="All tasks icon"
                class="logo-in-article"
              />
            </a>
            to view all taks or Search for tasks
            <a href="/tasks?search-term=#" className="">
              <img
                src="/src/assets/img/find-task-icon.svg"
                alt="All tasks icon"
                class="logo-in-article"
              />
            </a>
          </p>
        </div>
      </main>
    );
  }
}
