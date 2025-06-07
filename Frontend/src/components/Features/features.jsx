// import React, { useState } from 'react';
// import Carousel from 'react-bootstrap/Carousel';
// import feature1 from '../../assets/feature1.avif';
// import feature2 from '../../assets/feature2.avif';
// import feature3 from '../../assets/feature3.avif';
// import { Container } from 'react-bootstrap';

// function Features() {
//   const [index, setIndex] = useState(0);
//   const handleSelect = (selectedIndex) => setIndex(selectedIndex);

//   const slides = [
//     {
//       img: feature1,
//       title: "Performance Dashboard",
//       desc: "Track system performance and inspection stats in real-time.",
//     },
//     {
//       img: feature2,
//       title: "Real-Time Defect Detection",
//       desc: "Spot product flaws instantly using ML-integrated cameras.",
//     },
//     {
//       img: feature3,
//       title: "Smart Alerts",
//       desc: "Automatic alerts for missing safety gear or defects.",
//     },
//   ];

//   return (
//     <div className=" py-5">
//       {/* Centered Features Heading */}
//       <div className="text-center mb-3">
//         <h1 className="fw-bold">Features</h1>
//       </div>

//       <Container className='container-fluid'>
//         <div className="mx-auto" >
//           <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} fade>
//             {slides.map((slide, i) => (
//               <Carousel.Item key={i}>
//                 <div className="position-relative">
//                   {/* Image */}
//                   <img
//                     className="d-block w-100 rounded"
//                     src={slide.img}
//                     alt={`Slide ${i}`}
//                     style={{ height: '500px', objectFit: 'cover' }}
//                   />

//                   {/* Custom Indicators */}
//                   <div
//                     className="position-absolute start-50 translate-middle-x d-flex gap-2"
//                     style={{ bottom: '70px', zIndex: 2 }}
//                   >
//                     {slides.map((_, j) => (
//                       <div
//                         key={j}
//                         onClick={() => setIndex(j)}
//                         className={`rounded-circle ${index === j ? 'bg-white' : 'bg-secondary'}`}
//                         style={{
//                           width: 12,
//                           height: 12,
//                           opacity: 0.8,
//                           cursor: 'pointer',
//                         }}
//                       ></div>
//                     ))}
//                   </div>

//                   {/* Text Strip at Bottom */}
//                   <div
//                     className="position-absolute bottom-0 w-100 text-white px-4 py-2 text-center"
//                     style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
//                   >
//                     <h5 className="mb-1">{slide.title}</h5>
//                     <p className="mb-0">{slide.desc}</p>
//                   </div>
//                 </div>
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </div>
//       </Container>
//     </div>
//   );
// }

// export default Features;

// src/components/Features/features.js
import React from 'react';
import feature1 from '../../assets/feature1.avif';
import feature2 from '../../assets/feature2.avif';
import feature3 from '../../assets/feature3.png';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './features.css'; // Ensure you have this CSS file
const Features = () => {
  return (
    <>
      <section className="feature-section">
        <Container fluid className="d-flex align-items-center h-100">
          <Row className="w-100 align-items-center">
            <Col md={6} className="px-5">
              <h1 className="display-5 fw-bold mb-5"> PERFORMANCE DASHBOARD</h1>
              <p className="lead mb-5">The performance dashboard in DeepInspect provides real-time visualization of production line metrics, including defect count, detection accuracy, and product throughput. It enables operators and admins to monitor system health, identify recurring issues, and take timely action to minimize downtime and improve quality control.</p>
              <Button variant="outline-dark" size="lg">Discover More →</Button>
            </Col>
            <Col md={6} className="text-center h-100">
              <img src={feature1} alt="Operational Optimization" className="feature-image" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="feature-section bg-light">
        <Container fluid className="d-flex align-items-center h-100">
          <Row className="w-100 align-items-center flex-row-reverse">
            <Col md={6} className="px-5">
              <h1 className="display-5 fw-bold mb-5">REAL-TIME DEFECT DETECTION</h1>
              <p className="lead mb-5">Real-time defect detection in DeepInspect uses camera feeds and a ML model to instantly identify and localize defects on products as they move through the assembly line. This immediate feedback allows quick intervention, reducing the chances of faulty items progressing further in the production process.</p>
              <Button variant="outline-dark" size="lg">Learn More →</Button>
            </Col>
            <Col md={6} className="text-center h-100">
              <img src={feature2} alt="Real-time Inspection" className="feature-image" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="feature-section">
        <Container fluid className="d-flex align-items-center h-100">
          <Row className="w-100 align-items-center">
            <Col md={6} className="px-5">
              <h1 className="display-5 fw-bold mb-5">SMART ALERTS </h1>
              <p className="lead mb-5">Smart alerts in DeepInspect automatically notify the admin or operator when a defect is detected, specifying the type and location of the issue. These alerts are delivered through the dashboard or via email, enabling prompt action to prevent defective products from reaching the next production stage.</p>
              <Button variant="outline-dark" size="lg">Discover More →</Button>
            </Col>
            <Col md={6} className="text-center h-100">
              <img src={feature3} alt="Operational Optimization" className="feature-image" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};


export default Features;
