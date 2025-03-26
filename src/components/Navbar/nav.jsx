import React from "react";
import "./nav.css";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar bg-dark border-bottom border-body px-5 py-3" >
      <div className="container-fluid ">
        <a className="navbar-brand text-white fs-4 px-3 fw-bold" href="#">DEEPINSPECT</a>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link text-white fs-5 px-4 " href="#about">About Us</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white fs-5 px-4" href="#features">Features</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white fs-5 px-4" href="#partners">Partners</a>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-light fs-5 ms-4 px-4 loginBtn" type="button" onClick={() => navigate('/login')}  >Login</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
