import React, { useEffect, useState } from "react";
import { Container, Button, Navbar, Nav, Card, Form, Row, Col, Accordion, Badge } from "react-bootstrap";
import SupervisorInfo from "./supervisorInfo"; // Removed the reference to SupervisorInfo
import AccessControl from "./accessControl";   // Removed the reference to AccessControl
import CreateUserForm from "../createUserForm";
import dummyUsers from "../../data/users";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handleDeleteUser = (username) => {
    setUsers(users.filter((u) => u.username !== username));
    if (selectedUser && selectedUser.username === username) {
      setSelectedUser(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedUser({ ...selectedUser });
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    setUsers(users.map((user) => (user.username === editedUser.username ? editedUser : user)));
    setSelectedUser(editedUser);
    setIsEditing(false);
  };

  const roleColor = (role) => {
    switch (role) {
      case "admin": return "danger";
      case "supervisor": return "info";
      case "operator": return "success";
      default: return "secondary";
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded shadow-sm px-3">
        <Navbar.Brand className="mb-2"><strong>Admin Dashboard</strong></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link href="#">Users</Nav.Link>
            <Nav.Link href="#access">Access</Nav.Link>
            <Nav.Link href="./login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  
      <Row>
        <Col md={4}>
          <h5 className="mb-4">👥 Users</h5>
          <Accordion defaultActiveKey="0">
            {["admin", "supervisor", "operator"].map((role, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={role}>
                <Accordion.Header className="text-capitalize">{role}s</Accordion.Header>
                <Accordion.Body>
                  {users
                    .filter(user => user.role === role)
                    .map(user => (
                      <Button
                        key={user.username}
                        variant="outline-primary"
                        className="mb-2 w-100 text-start"
                        onClick={() => handleSelectUser(user)}
                      >
                        {user.username}
                      </Button>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
  
        <Col md={8}>
          {selectedUser && (
            <Card className="shadow-sm border-0" style={{ minHeight: "300px" }}>
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">🧾 User Details</h5>
              </Card.Header>
              <Card.Body>
                {isEditing ? (
                  <Form>
                    <Row className="mb-3">
                      <Col>
                        <Form.Control
                          name="fullName"
                          value={editedUser.fullName}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          name="email"
                          value={editedUser.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          type="email"
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Control
                          name="phone"
                          value={editedUser.phone}
                          onChange={handleInputChange}
                          placeholder="Phone"
                          type="number"
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          name="role"
                          value={editedUser.role}
                          placeholder="Role"
                          readOnly
                        />
                      </Col>
                    </Row>
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={handleSaveEdit}>💾 Save</Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>❌ Cancel</Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                    <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone}</p>
                    <p><strong>Role:</strong> <Badge bg={roleColor(selectedUser.role)}>{selectedUser.role}</Badge></p>
                    <div className="d-flex gap-2 mt-3">
                      <Button variant="warning" onClick={handleEditToggle}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDeleteUser(selectedUser.username)}>Delete</Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
  
      <div className="mt-5">
        <CreateUserForm />
      </div>
    </Container>
  );
}

export default AdminDashboard;
