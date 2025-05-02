import React, { useState } from "react";
import { Button, Form, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import { registerUser } from "../api";

const CreateUserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("supervisor");
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required!";
    if (!email || !validateEmail(email)) newErrors.email = "Invalid email!";
    if (!phone || !validatePhone(phone)) newErrors.phone = "Invalid phone number!";
    if (!password || !validatePassword(password)) newErrors.password = "Password must be at least 8 characters and include letters and numbers.";
    if (!role) newErrors.role = "Role is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerUser({ username, password, email, phone, role });

      // Reset form and show toast
      setUsername("");
      setPassword("");
      setEmail("");
      setPhone("");
      setRole("supervisor");
      setErrors({});
      setShowToast(true);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="mb-4">Create New User</h4>
      <Form>
        <Row className="mb-1">
          <Col sm={6}>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-1">
          <Col sm={6}>
            <Form.Control
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Col>
          <Col sm={6}>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={6}>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Select Role"
              required
              isInvalid={!!errors.role}
            >
              <option value="supervisor">Supervisor</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
          </Col>
        </Row>

        <Button variant="primary" onClick={handleSubmit}>
          Create User
        </Button>
      </Form>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">✅ User Created Successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CreateUserForm;
