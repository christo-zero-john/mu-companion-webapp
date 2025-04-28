import TaskItemButtons from "./task-item-buttons";

export default function TaskItem({ task, ...props }) {
  function viewTaskHandler() {}

  return (
    <div
      className="task-item-wrap col-12 col-md-5 mb-1 m-md-2 mx-auto p-2"
      props
    >
      <div className="task-item" onClick={viewTaskHandler}>
        <div className="">
          <p className="name">Is It a Bird?</p>
          <p className="ig">ai</p>
        </div>
        <p className="hashtag">#cl-ai-birdmodel</p>

        <div className="total-trackings">
          <img
            src="/src/assets/img/tracked-task-icon.svg"
            alt=""
            className="task-stat-img"
          />
          <p className="task-stat-text">1</p>
        </div>

        <div className="total-completions">
          <img
            src="/src/assets/img/completed-task-icon.svg"
            alt=""
            className="task-stat-img"
          />
          <p className="task-stat-text">1</p>
        </div>

        <p className="karma-points">300</p>
      </div>
      <TaskItemButtons />
    </div>
  );
}
