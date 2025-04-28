import { useState } from "react";
import TaskItem from "./task-item";

/**
 * Route to print all tasks
 */
export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  tasks.length == 0 && <p className="">Loading...</p>;
  return (
    <div className="bg-dark text-light">
      <p className="">Tasks Found: {tasks.length}</p>
      <TaskItem />
      <div className="">
        {tasks.map((task) => (
          <TaskItem task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
}
