import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/routes/dashboard/dashboard";
import "./styles/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/defaults.css";
import Settings from "./components/routes/settings/settings";
import Guide from "./components/routes/guide/guide";
import Tasks from "./components/routes/tasks/tasks";
import TodoTasks from "./components/routes/todo-tasks/todo-tasks";
import CompletedTasks from "./components/routes/completed-tasks/completed-tasks";
import RemovedTasks from "./components/routes/removed-tasks/removed-tasks";
import Admin from "./components/routes/admin/admin";
import Contribute from "./components/routes/contribute/contribute";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/profile/tasks/todo" element={<TodoTasks />} />
      <Route path="/profile/tasks/removed" element={<RemovedTasks />} />
      <Route path="/profile/tasks/completed" element={<CompletedTasks />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/contribute" element={<Contribute />} />
      <Route path="/support" element={<Dashboard />} />
      <Route path="/about" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
