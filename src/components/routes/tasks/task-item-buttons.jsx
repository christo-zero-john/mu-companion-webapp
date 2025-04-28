export default function TaskItemButtons() {
  return (
    <div className="buttons" id="buttons" onclick="">
      <button
        className="btn"
        onclick="appFunctions.trackTask('#cl-ai-birdmodel','all')"
      >
        <img
          src="/assets/img/track-task-icon.svg"
          alt="track this task"
        />
      </button>
    </div>
  );
}
