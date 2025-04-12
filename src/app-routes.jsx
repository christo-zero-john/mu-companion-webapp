import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/home/home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
