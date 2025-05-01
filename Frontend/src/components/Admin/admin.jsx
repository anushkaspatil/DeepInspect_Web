import React, { useEffect, useState } from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import SupervisorInfo from "./supervisorInfo";
import AccessControl from "./accessControl";
import CreateUserForm from "../createUserForm";
import { fetchUsers } from "../../api";
import dummyUsers from "../../data/users";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  return (
    <Container fluid className="p-4">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Navbar.Brand>Admin</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link href="#">Users</Nav.Link>
            <Nav.Link href="#access">Access</Nav.Link>
            <Nav.Link href="./login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <h2>Users</h2>
      <div className="d-flex gap-3 flex-wrap">
        {users.map(user => (
          <Button key={user.username} variant="primary">
            {user.username} ({user.role})
          </Button>
        ))}
      </div>

      <CreateUserForm />
      <SupervisorInfo />
      <AccessControl />
    </Container>
  );
};

export default AdminDashboard;
