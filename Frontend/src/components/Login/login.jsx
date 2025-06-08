import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { User, Shield, UserCheck, AlertCircle, LogIn, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import users from '../../data/users';
import './login.css';

const Login = () => {
  const [role, setRole] = useState('operator');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roleConfig = {
    operator: {
      icon: User,
      description: 'Basic system operations and monitoring',
      title: 'Operator Access'
    },
    supervisor: {
      icon: UserCheck,
      description: 'Team oversight and advanced controls',
      title: 'Supervisor Access'
    },
    admin: {
      icon: Settings,
      description: 'Full system administration access',
      title: 'Administrator Access'
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (!user) {
      setError('Invalid credentials or role selection. Please try again.');
      setIsLoading(false);
    } else {
      // Navigate to appropriate dashboard based on role
      if (role === "operator") navigate("/operator");
      else if (role === "supervisor") navigate("/supervisor");
      else if (role === "admin") navigate("/admin");
      
      setIsLoading(false);
    }
  };

  const RoleIcon = roleConfig[role].icon;

  return (
    <div className={`login-container ${role} d-flex align-items-center justify-content-center p-4`}>
      <Container fluid className="h-100">
        <Row className="justify-content-center h-100">
          <Col xl={10} lg={11} className="d-flex align-items-center">
            <div className="main-card w-100">
              <Row className="g-0 h-100">
                
                {/* Left Side - Role Selection & Branding */}
                <Col lg={5} className={`role-panel ${role} d-flex flex-column justify-content-center align-items-center text-white p-5`}>
                  <div className="text-center w-100 fade-in-up">
                    
                    {/* Brand Section */}
                    <div className="mb-3">
                      <div className="brand-icon">
                        <Shield size={48} className="text-white" />
                      </div>
                      <h1 className="display-6 fw-bold mb-1">SecureAccess</h1>
                      <p className="fs-6 opacity-75">Enterprise Management Portal</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-5">
                      <h3 className="h3  fw-semibold mb-4">Select Your Role</h3>
                      
                      <div className="d-grid gap-3">
                        {Object.entries(roleConfig).map(([key, config]) => {
                          const IconComponent = config.icon;
                          const isSelected = role === key;
                          
                          return (
                            <button
                              key={key}
                              onClick={() => setRole(key)}
                              className={`role-button ${isSelected ? 'active' : ''} d-flex align-items-center text-start`}
                            >
                              <div className="role-icon-container">
                                <IconComponent size={24} />
                              </div>
                              <div>
                                <h5 className="mb-1 text-capitalize fw-semibold">{key}</h5>
                                <small className="opacity-75">{config.description}</small>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current Role Display */}
                    <div className="current-role-display">
                      <RoleIcon size={64} className="mb-3 opacity-75" />
                      <h4 className="fw-semibold text-capitalize mb-2">{roleConfig[role].title}</h4>
                      <p className="mb-0 opacity-75">{roleConfig[role].description}</p>
                    </div>
                  </div>
                </Col>

                {/* Right Side - Login Form */}
                <Col lg={7} className="d-flex flex-column justify-content-center p-5">
                  <div className="mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
                    
                    {/* Header */}
                    <div className="text-center mb-5 fade-in-up">
                      <h2 className="display-5 fw-bold text-dark mb-3">Welcome Back</h2>
                      <p className="fs-5 text-muted">Sign in to access your dashboard</p>
                    </div>

                    {/* Login Form */}
                    <Form onSubmit={handleLogin} className="fade-in-up">
                      
                      {/* Error Alert */}
                      {error && (
                        <div className="error-alert d-flex align-items-center mb-4 pulse">
                          <AlertCircle size={20} className="me-3 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {/* Username Field */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark mb-3">Username</Form.Label>
                        <div className="position-relative">
                          <User size={20} className="input-icon" />
                          <Form.Control
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="ps-5"
                          />
                        </div>
                      </Form.Group>

                      {/* Password Field */}
                      <Form.Group className="mb-5">
                        <Form.Label className="fw-semibold text-dark mb-3">Password</Form.Label>
                        <div className="position-relative">
                          <Shield size={20} className="input-icon" />
                          <Form.Control
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="ps-5"
                          />
                        </div>
                      </Form.Group>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={`login-btn ${role} w-100 text-white d-flex align-items-center justify-content-center`}
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-3\" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <LogIn size={20} className="me-3" />
                            <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                          </>
                        )}
                      </Button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row> 
      </Container>
    </div>
  );
};

export default Login;