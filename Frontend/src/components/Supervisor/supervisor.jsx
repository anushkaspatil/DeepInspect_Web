import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, BarChart3, Settings, LogOut } from 'lucide-react';

const SupervisorPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Container className="mt-4">
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

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Users size={24} className="text-primary me-2" />
                <Card.Title className="mb-0">Team Management</Card.Title>
              </div>
              <Card.Text>
                Manage team members and their activities.
              </Card.Text>
              <Button variant="primary">Manage Team</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <BarChart3 size={24} className="text-info me-2" />
                <Card.Title className="mb-0">Reports & Analytics</Card.Title>
              </div>
              <Card.Text>
                View detailed reports and analytics.
              </Card.Text>
              <Button variant="info">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Settings size={24} className="text-warning me-2" />
                <Card.Title className="mb-0">System Controls</Card.Title>
              </div>
              <Card.Text>
                Access advanced system controls and settings.
              </Card.Text>
              <Button variant="warning">System Settings</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SupervisorPage;