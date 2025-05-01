import React from 'react';
import aboutImage from "../../assets/background.avif";

const AboutUs = () => {
  return (
    <div className="d-flex flex-wrap min-vh-100 bg-light text-light">
      {/* Left Content */}
      <div className="col-md-6 d-flex align-items-center justify-content-center p-5" style={{ backgroundColor: '#111' }}>
        <div className="border-start border-2 ps-4">
          <h2 className="text-uppercase mb-3 d-block text-light">About Us</h2>
          <p className="fs-5 mb-4 text-light" style={{ maxWidth: '400px' }}>
            DeepInspect is revolutionizing the way businesses manage their operations and processes.
          </p>
          <p className="text-light" style={{ maxWidth: '400px' }}>
            Our innovative solutions enable businesses to streamline their workflows, optimize their resources, and achieve peak efficiency. 
            We are dedicated to redefining business management by providing cutting-edge tools and insights.
          </p>
        </div>
      </div>

      {/* Right Background Image */}
      <div
        className="col-md-6 bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
        }}
      ></div>
    </div>
  );
};

export default AboutUs;