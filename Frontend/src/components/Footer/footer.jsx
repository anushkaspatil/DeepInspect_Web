import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-5  border-top bg-light">
      <p className="mb-2 fw-semibold fs-6">&copy; {new Date().getFullYear()} DeepInspect. All rights reserved.</p>
      <small className="d-block">Empowering Smart Manufacturing with Real-Time Insights.</small>
    </footer>

  );
};

export default Footer;
