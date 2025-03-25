import React from "react";

function Navbar() {
  return (
    <nav className="navbar bg-dark border-bottom border-body " >
      <div className="container-fluid ">
        <a className="navbar-brand text-white" href="#">DeepInspect</a>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link text-white" href="#about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#features">Features</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#partners">Partners</a>
          </li>
          <button className="btn btn-outline-success" id="loginBtn" type="button">Login</button>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
