import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import "./styles/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/defaults.css";
import Settings from "./components/settings/settings";
import Guide from "./components/guide/guide";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/tasks" element={<Dashboard />} />
      <Route path="/profile/tasks/todo" element={<Dashboard />} />
      <Route path="/profile/tasks/removed" element={<Dashboard />} />
      <Route path="/profile/tasks/completed" element={<Dashboard />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/contribute" element={<Dashboard />} />
      <Route path="/support" element={<Dashboard />} />
      <Route path="/about" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
