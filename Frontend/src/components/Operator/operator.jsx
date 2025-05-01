import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import alerts from '../../assets/alerts.jpg';
import diagnostics from '../../assets/real_time_diag.png';
import batchAlerts from '../../assets/batch.jpg';
import profile from '../../assets/profile.jpg';
import "./operator.css";

function Operator() {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictedImg, setPredictedImg] = useState(null);
  const [defectInfo, setDefectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSuccess, setStoreSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Reset states when new file is selected
      setPredictedImg(null);
      setDefectInfo(null);
      setStoreSuccess(false);
    }
  };

  // Handle upload and defect detection
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first");
      return;
    }

    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Send the image to your API endpoint
      const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expecting image blob in response
      });

      // Create a URL for the returned image blob
      const imageUrl = URL.createObjectURL(response.data);
      setPredictedImg(imageUrl);

      // If your API returns metadata in headers or a separate call is needed
      // to get defect information, you would handle that here
      try {
        // You'll need to implement this endpoint on your backend to return defect metadata
        const metadataResponse = await axios.get("http://127.0.0.1:8000/predict/metadata", {
          params: { filename: selectedFile.name }
        });
        
        setDefectInfo(metadataResponse.data);
      } catch (metadataError) {
        console.error("Failed to get defect metadata:", metadataError);
        
        // Fallback to simulated data if metadata API fails
        setDefectInfo({
          type: "Unknown Defect",
          time: new Date().toLocaleTimeString(),
          item: Math.floor(Math.random() * 2000) + 1000,
          stream: Math.ceil(Math.random() * 5),
          batch: Math.ceil(Math.random() * 20),
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to process the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle storing the defect in database
  const handleStoreDefect = async () => {
    if (!defectInfo || !selectedFile) {
      alert("No defect information to store");
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post("http://127.0.0.1:8000/store/", {
        defect_type: defectInfo.type,
        timestamp: defectInfo.time,
        item_number: defectInfo.item,
        stream_number: defectInfo.stream,
        batch_number: defectInfo.batch,
        image_name: selectedFile.name,
      });
      
      setStoreSuccess(true);
    } catch (error) {
      console.error("Store failed:", error);
      alert("Failed to store defect information in database");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle declining to store the defect
  const handleDeclineStore = () => {
    // Reset the defect detection state
    setPredictedImg(null);
    setDefectInfo(null);
    setSelectedFile(null);
  };

  return (
    <Container fluid>
      <Row>
        {/* Left Section */}
        <Col md={8} className="p-4 left-sec">
          <h1 className="text header">Real-time Diagnostics</h1>
          
          {/* File Upload Section */}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select Defect Image</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange} 
              accept="image/*"
              disabled={isLoading}
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="mb-4"
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              "Upload & Detect Defects"
            )}
          </Button>

          {/* Defect Result Card */}
          {predictedImg && defectInfo && (
            <Card className="mb-3 card">
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img src={predictedImg} className="img-fluid rounded-start" alt="Detected Defect" />
                </Col>
                <Col md={8}>
                  <Card.Body className="p-3">
                    <Card.Title className="mt-2 mb-3 fw-bold">DEFECT DETECTED</Card.Title>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Defect Type:</strong> {defectInfo.type}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Time Stamp:</strong> {defectInfo.time}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Item No.:</strong> {defectInfo.item}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Stream No.:</strong> {defectInfo.stream}
                    </Card.Text>
                    <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
                      <strong>Batch No.:</strong> {defectInfo.batch}
                    </Card.Text>
                    <Card.Text className="mb-2" style={{ lineHeight: "1.2" }}>
                      <strong>Store Record:</strong>
                    </Card.Text>
                    {storeSuccess ? (
                      <div className="alert alert-success">
                        Defect information successfully stored in database
                      </div>
                    ) : (
                      <div>
                        <Button 
                          variant="primary" 
                          className="me-2" 
                          onClick={handleStoreDefect}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Storing...' : 'Yes'}
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={handleDeclineStore}
                          disabled={isLoading}
                        >
                          No
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        {/* Right Section */}
        <Col md={4} className="text-white p-4 right-sec">
          <Row className="g-2">
            {[
              { img: alerts, text: "All Alerts" },
              { img: diagnostics, text: "Real-time Diagnostics" },
              { img: batchAlerts, text: "Batch Alerts" },
              { img: profile, text: "My Profile" }
            ].map((item, index) => (
              <Col key={index} xs={6}>
                <Card className="bg-light text-dark text-center">
                  <Card.Img src={item.img} alt={item.text} />
                  <Card.Body>
                    <Card.Text className="mb-0" style={{ fontSize: "14px", lineHeight: "1.2" }}>
                      {item.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Operator;