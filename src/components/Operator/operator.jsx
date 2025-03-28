import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import defectImg1 from '../../assets/defect1.jpg';
import defectImg2 from '../../assets/defect2.jpg';
import alerts from '../../assets/alerts.jpg';
import diagnostics from '../../assets/real_time_diag.png';
import batchAlerts from '../../assets/batch.jpg';
import profile from '../../assets/profile.jpg';
import "./operator.css";

function Operator() {
  return (
    <Container fluid>
      <Row>
        {/* Left Section */}
        <Col md={8} className="p-4 left-sec"> 
          <h1 className="text header">Real-time Diagnostics</h1>

          {/* Defect Cards */}
          {[{ img: defectImg1, type: "Patches", time: "11:23:45", item: "1242", stream: "5", batch: "15" },
            { img: defectImg2, type: "Scratches", time: "11:21:45", item: "1182", stream: "2", batch: "10" }
          ].map((defect, index) => (
            <Card key={index} className="mb-3 card">
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img src={defect.img} className="img-fluid rounded-start" alt="Defect" />
                </Col>
                <Col md={8}>
                  <Card.Body className="p-3">
                    <Card.Title className="mt-2 mb-3 fw-bold">DEFECT DETECTED</Card.Title>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Defect Type:</strong> {defect.type}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Time Stamp:</strong> {defect.time}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Item No.:</strong> {defect.item}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Stream No.:</strong> {defect.stream}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Batch No.:</strong> {defect.batch}
                    </Card.Text>
                    <Card.Text className="mb-2" style={{ lineHeight: "1.2" }}>
                      <strong>:</strong>
                    </Card.Text>
                    <Button variant="primary" className="me-2">Yes</Button>
                    <Button variant="secondary">No</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>

        {/* Right Section */}
        <Col md={4} className="text-white p-4 right-sec">
          <Row className="g-2 ">
            {[{ img: alerts, text: "All Alerts" },
              { img: diagnostics, text: "Real-time Diagnostics" },
              { img: batchAlerts, text: "Batch Alerts" },
              { img: profile, text: "My Profile" }
            ].map((item, index) => (
              <Col key={index} xs={6}>
                <Card className="bg-light text-dark text-center">
                  <Card.Img src={item.img} alt={item.text} />
                  <Card.Body>
                    <Card.Text className="mb-0" style={{ fontSize: "14px", lineHeight: "1.2" }}>{item.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>  
    </Container>
  );
};

export default Operator;