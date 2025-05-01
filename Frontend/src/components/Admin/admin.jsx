import React from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import SupervisorInfo from "./supervisorInfo";
import AccessControl from "./accessControl";

const AdminDashboard = () => {
  return (
    <Container fluid className="p-4">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Navbar.Brand>Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#">Users</Nav.Link>
            <Nav.Link href="#access">Access</Nav.Link>
            <Nav.Link href="./login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Users Section */}
      <h2>Users</h2>
      <div className="d-flex gap-3">
        <Button variant="primary">Supervisor 1</Button>
        <Button variant="primary">Supervisor 2</Button>
        <Button variant="primary">Operator 1</Button>
      </div>

      {/* Supervisor Info */}
      <SupervisorInfo />

      {/* Access Control */}
      <AccessControl />
    </Container>
  );
};

export default AdminDashboard;
