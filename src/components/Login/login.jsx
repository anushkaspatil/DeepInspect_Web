import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./login.css";

function Login() {
    const [role, setRole] = useState("operator");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in as:", { username, password, role });

        if (role === "operator") navigate("/operator");
        else if (role === "supervisor") navigate("/supervisor");
        else if (role === "admin") navigate("/admin");
    };

    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Row className="shadow-lg p-4 rounded login-container">
                {/* Left Side - Role Selection */}
                <Col md={5} className="d-flex flex-column align-items-center bg-dark text-white p-4 rounded-start">
                    <Form.Select 
                        className="mb-3" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="operator">Operator</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                    <Button variant="light" className="w-100">Continue As</Button>
                </Col>

                {/* Right Side - Login Form */}
                <Col md={7} className="p-4">
                    <h2 className="mb-4 text-center">Login</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="text" 
                                placeholder="Username" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="password" 
                                placeholder="Enter Password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
