import { useState } from "react";
import LoadingScreen from "../../common/loading-screen";
import { useEffect } from "react";
import NavBar from "../../common/nav-bar";
import CompletedTaskList from "./completed-task-list";
import FooterMenu from "./footer-menu";

export default function Dashboard() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(false);
  }, []);
  return (
    <div className="bg-dark text-light no-scrollbar">
      <LoadingScreen show={show} />
      <NavBar />
      <CompletedTaskList />
      <FooterMenu />
    </div>
  );
}
