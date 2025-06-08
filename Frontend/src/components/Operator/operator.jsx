import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
  Nav,
  Navbar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Upload, Eye, Database, AlertTriangle, CheckCircle, X } from "lucide-react";
import "./operator.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

function Operator() {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictedImg, setPredictedImg] = useState(null);
  const [defectInfo, setDefectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSuccess, setStoreSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      resetStates();
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        resetStates();
      }
    }
  };

  const resetStates = () => {
    setPredictedImg(null);
    setDefectInfo(null);
    setStoreSuccess(false);
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
      const response = await axios.post(`${API_BASE}/predict/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setPredictedImg(imageUrl);

      try {
        const metadataResponse = await axios.get(
          `${API_BASE}/predict/metadata`,
          {
            params: { filename: selectedFile.name },
          }
        );

        setDefectInfo(metadataResponse.data);
      } catch (metadataError) {
        console.error("Failed to get defect metadata:", metadataError);

        // Fallback to simulated data
        setDefectInfo({
          type: "Surface Crack",
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
      await axios.post(`${API_BASE}/store/`, {
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
    setPredictedImg(null);
    setDefectInfo(null);
    setSelectedFile(null);
  };

  return (
    <div className="operator-container">
      {/* Navigation Header */}
      <Navbar className="custom-navbar" expand="lg">
        <Container fluid>
          <Navbar.Brand className="navbar-brand-custom">
            <Eye className="me-2 nav-heading" size={28} />
            Quality Control Dashboard
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link className="nav-link-custom active">
              <Database className="me-1" size={16} />
              Real-time Diagnostics
            </Nav.Link>
            <Nav.Link className="nav-link-custom">
              <AlertTriangle className="me-1" size={16} />
              Alerts
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="main-content">
        <Row className="g-4">
          {/* Left Section - Upload and Controls */}
          <Col lg={5} className="left-section">
            <Card className="upload-card h-100">
              <Card.Body className="p-4">
                <div className="section-header mb-4">
                  <h2 className="section-title">
                    <Upload className="me-2" size={24} />
                    Image Upload & Analysis
                  </h2>
                  <p className="section-subtitle">
                    Upload defect images for real-time quality analysis
                  </p>
                </div>

                {/* File Upload Area */}
                <div
                  className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="upload-content">
                    <Upload size={48} className="upload-icon mb-3" />
                    {selectedFile ? (
                      <div className="file-info">
                        <CheckCircle size={24} className="text-success mb-2" />
                        <p className="mb-1"><strong>{selectedFile.name}</strong></p>
                        <p className="text-muted small">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2"><strong>Drop your image here or click to browse</strong></p>
                        <p className="text-muted small">Supports JPG, PNG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={isLoading}
                    className="d-none"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="file-input-label"></label>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons mt-4">
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className="analyze-btn w-100"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Eye className="me-2" size={18} />
                        Analyze for Defects
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats mt-4">
                  <Row>
                    <Col xs={4}>
                      <div className="stat-item">
                        <div className="stat-number">25</div>
                        <div className="stat-label">Id No</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="stat-item">
                        <div className="stat-number">operator1</div>
                        <div className="stat-label">Username</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="stat-item">
                        <div className="stat-number">Provided</div>
                        <div className="stat-label">Access</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Section - Results */}
          <Col lg={7} className="right-section">
            {predictedImg && defectInfo ? (
              <Card className="result-card">
                <Card.Header className="result-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <AlertTriangle className="me-2 text-warning" size={24} />
                      <h4 className="mb-0">Defect Detection Results</h4>
                    </div>
                    <Badge bg="warning" className="defect-badge">
                      DEFECT DETECTED
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="g-0 result-row">
                    <Col md={8} className="image-col">
                      <div className="image-container">
                        <img
                          src={predictedImg}
                          alt="Detected Defect"
                          className="result-image"
                        />
                        <div className="image-overlay">
                          <Badge bg="danger" className="defect-type-badge">
                            {defectInfo.type}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="details-col">
                      <div className="defect-details p-4">
                        <h5 className="details-title mb-3">Defect Information</h5>
                        
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{defectInfo.type}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Timestamp:</span>
                          <span className="detail-value">{defectInfo.time}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Item No:</span>
                          <span className="detail-value">#{defectInfo.item}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Stream:</span>
                          <span className="detail-value">Stream {defectInfo.stream}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Batch:</span>
                          <span className="detail-value">Batch {defectInfo.batch}</span>
                        </div>

                        <hr className="my-3" />

                        <div className="store-section">
                          <h6 className="store-title">Store in Database</h6>
                          {storeSuccess ? (
                            <Alert variant="success" className="success-alert">
                              <CheckCircle size={16} className="me-2" />
                              Successfully stored in database
                            </Alert>
                          ) : (
                            <div className="store-buttons">
                              <Button
                                variant="success"
                                onClick={handleStoreDefect}
                                disabled={isLoading}
                                className="store-btn me-2"
                              >
                                {isLoading ? (
                                  <>
                                    <Spinner size="sm" className="me-1" />
                                    Storing...
                                  </>
                                ) : (
                                  <>
                                    <Database size={16} className="me-1" />
                                    Store
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={handleDeclineStore}
                                disabled={isLoading}
                                className="decline-btn"
                              >
                                <X size={16} className="me-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <Card className="placeholder-card h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <div className="placeholder-content text-center">
                    <Eye size={64} className="placeholder-icon mb-3" />
                    <h4 className="placeholder-title">Waiting for Analysis</h4>
                    <p className="placeholder-text">
                      Upload and analyze an image to see defect detection results here
                    </p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Operator;