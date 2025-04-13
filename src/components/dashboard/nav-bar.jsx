import React from "react";
import { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasToggling,
} from "react-bootstrap";

export default function NavBar() {
  const [show, setShow] = useState(false);

  return (
    <header className="">
      <nav className="m-0">
        <img
          onClick={() => setShow(true)}
          src="/src/assets/img/nav-icon.svg"
          alt=""
          className="navIcon"
        />
        <h1 className="title">mu-companion</h1>
        <button
          className="guide-btn d-none d-md-inline"
          onclick="interface.guide()"
        >
          <img src="/src/assets/img/guide.png" alt="" className="" />
          Guide
        </button>
        <Offcanvas show={show} className="bg-dark text-light col-md-9">
          <OffcanvasHeader>
            <OffcanvasTitle className="w-100">
              MENU{" "}
              <img
                src="/src/assets/img/close-button.svg"
                alt=""
                className="close-btn float-end"
                onClick={() => setShow(false)}
              />
            </OffcanvasTitle>
          </OffcanvasHeader>

          {/* <!-- MENU ITEMS --> */}
          <div className="offcanvas-body no-scrollbar pb-5 mb-4">
            <a href="/profile/settings" className="normal-link py-2 d-block fw-100">
              Settings
            </a>
            <a
              href="/guide"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.guide()"
            >
              Get Started
            </a>
            <a
              href="/tasks"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.printAllTasks()"
            >
              All Mulearn Tasks
            </a>
            <a
              href="/tasks?search-terms=#"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.findTask()"
            >
              Find Tasks
            </a>
            <a
              href="/profile/tasks/todo"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.printTrackedTasks()"
            >
              ToDo tasks
            </a>
            <a
              href="/profile/tasks/removed"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.printRemovedTracks()"
            >
              Removed tasks
            </a>
            <a
              href="/profile/tasks/completed"
              className="normal-link py-2 d-block fw-100"
              onclick="interface.printCompletedTasks()"
            >
              Completed tasks
            </a>{" "}
            <a href="/admin" className="normal-link py-2 d-block fw-100">
              Admin Dashboard
            </a>
            <a href="/contribute" className="normal-link py-2 d-block fw-100">
              Contribute
            </a>
            <a href="/support" className="normal-link py-2 d-block fw-100">
              Support Center
            </a>
            <a href="/about" className="normal-link py-2 d-block fw-100">
              About
            </a>
            <a
              href="https://github.com/christo-zero-john/mu-companion-webapp/stargazers"
              className="link-aqua"
            >
              <div className="github d-flex flex-row justify-content-center m-0 pb-0">
                <p className="">Star on Github</p>
                <img src="/src/assets/img/github.svg" alt="" className="" />
              </div>
            </a>
          </div>
        </Offcanvas>
      </nav>
      {/* <!-- MENU ITEMS UP --> */}

      {/* <!-- Dashboard div --> */}
      <div
        id="dashboard"
        className="d-flex flex-row justify-content-around align-items-center"
      ></div>
    </header>
  );
}
