import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./nav.css";

function CustomNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="transparent-navbar border-bottom border-body px-5 py-3">
      <Container fluid>
        {/* Brand Name */}
        <Navbar.Brand className="fs-4 fw-bold px-3">DEEPINSPECT</Navbar.Brand>
        
        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#about" className="fs-5 px-4 text-white">About Us</Nav.Link>
            <Nav.Link href="#features" className="fs-5 px-4 text-white">Features</Nav.Link>
            <Nav.Link href="#partners" className="fs-5 px-4 text-white">Partners</Nav.Link>
            <Button 
              variant="outline-light" 
              className="fs-5 ms-4 px-4 loginBtn"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
