import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login/login";
import Home from "./components/Home/home";
import OperatorPage from "./components/Operator/operator";
import SupervisorPage from "./components/Supervisor/supervisor";
import AdminPage from "./components/Admin/admin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
