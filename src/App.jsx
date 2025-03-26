import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/Navbar/nav";
import Login from "./components/Login/login";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Features from "./components/Features/features";
import Partners from "./components/Partners/partners";
import OperatorPage from "./components/Operator/operator";
import SupervisorPage from "./components/Supervisor/supervisor";
import AdminPage from "./components/Admin/admin";

function App() {
  return (
    <>
      <Navbar />  {/* Navbar is always visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/partners" element={<Partners />} />
        
        {/* Role-based routes */}
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/supervisor" element={<SupervisorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
