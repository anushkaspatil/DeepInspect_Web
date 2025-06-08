import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, BarChart3, Settings, LogOut } from 'lucide-react';

const SupervisorPage = () => {
  const navigate = useNavigate();
  
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the secure URL from our FastAPI backend
  const fetchDashboardUrl = async () => {
    // Retrieve the auth token stored after login.
    // In a real app, you'd get this from context or a global state manager.
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError("Authentication error. Please log in again.");
      // Optional: Redirect to login
      // navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/metabase-dashboard-url', {
        headers: {
          // *** THIS IS THE CRUCIAL PART ***
          // Include the JWT token in the Authorization header
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
         throw new Error("You are not authorized to view this dashboard.");
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardUrl(data.url);

    } catch (err) {
      console.error("Failed to fetch Metabase dashboard URL:", err);
      setError(err.message || "Could not load dashboard. Please try again later.");
      setDashboardUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDashboard = () => {
    fetchDashboardUrl();
    setShowDashboard(true);
  };
  
  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setDashboardUrl('');
    setError(null);
  };

  const handleLogout = () => {
    // Clear the token on logout
    localStorage.removeItem('accessToken');
    navigate('/login');
  };
  
  // The rest of your component remains the same...

  return (
    <>
      <Container className="mt-4">
        {/* ... Header ... */}
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <UserCheck size={32} className="text-success me-3" />
                <div>
                  <h2 className="mb-0">Supervisor Dashboard</h2>
                  <p className="text-muted mb-0">Team oversight and advanced controls</p>
                </div>
              </div>
              <Button variant="outline-danger" onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Logout
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* ... Cards ... */}
        <Row>
            {/* ... Other cards ... */}
            <Col md={6} className="mb-4">
                <Card>
                <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                    <BarChart3 size={24} className="text-info me-2" />
                    <Card.Title className="mb-0">Reports & Analytics</Card.Title>
                    </div>
                    <Card.Text>
                    View detailed reports and analytics for the team.
                    </Card.Text>
                    <Button variant="info" onClick={handleShowDashboard}>
                    View Reports
                    </Button>
                </Card.Body>
                </Card>
            </Col>
            {/* ... Other cards ... */}
        </Row>
      </Container>

      {/* ... Modal ... (same as before) */}
      <Modal show={showDashboard} onHide={handleCloseDashboard} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Analytics Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" />
            </div>
          )}
          {error && !isLoading && (
             <p className="text-danger text-center">{error}</p>
          )}
          {!isLoading && !error && dashboardUrl && (
            <iframe
              src={dashboardUrl}
              frameBorder="0"
              width="100%"
              height="100%"
              allowTransparency
              title="Metabase Dashboard"
            ></iframe>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SupervisorPage;