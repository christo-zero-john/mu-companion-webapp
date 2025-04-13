export default function LoadingScreen({ show = false }) {
  return (
    show && (
      <div id="loading-div">
        <div class="">
          <img
            src="/assets/img/favicon.svg"
            alt=""
            class="menu-icon load-icon"
          />
          <p class="name d-inline mx-2">mu-companion</p>
        </div>

        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  );
}
