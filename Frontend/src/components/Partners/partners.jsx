import React from 'react';
import pvgLogo from '../../assets/pvgcoet-logo.jpg';
import saplLogo from '../../assets/sapl-logo.png';

const PartnersSection = () => {
  return (
    <div className="d-flex flex-wrap min-vh-100 bg-light text-light">
      {/* Left Content */}
      <div className="col-md-6 d-flex align-items-center justify-content-center p-5" style={{ backgroundColor: '#111' }}>
        <div className="border-start border-2 ps-4">
          <h2 className="text-uppercase mb-3 d-block text-light">Our Partners</h2>
          <p className="fs-5 mb-4 text-light" style={{ maxWidth: '400px' }}>
          DeepInspect collaborates with leading industry partners to deliver comprehensive business management solutions. 
          </p>
          <p className="text-light" style={{ maxWidth: '400px' }}>
          Synergytech Automation Pvt. Ltd. Pune is an experienced engineering services provider, is a rapidly growing organization with a capacity to ramp up operations very quickly. It offers a unique blend of expertise in end user industry. Synergytech Automation Pvt.Ltd. is completely customer focused and strives to develop long term partnerships.
          </p>
        </div>
      </div>
        {/* Column 2: Logos */}
        <div className="bg-dark col-12 col-md-6 text-center d-flex flex-column justify-content-center">
          <div className="mb-4">
            <img
              src={saplLogo}
              alt="SAPL Logo"
              className="img-fluid mb-2"
              style={{ maxHeight: '100px' }}
            />
            <p className="mb-0">Synergytech Automation Pvt. Ltd.</p>
            <p>Pune</p>
          </div>
          <div>
            <img
              src={pvgLogo}
              alt="PVG Logo"
              className="img-fluid mb-2"
              style={{ maxHeight: '150px' }}
            />
            <p>PVG's COET, Pune</p>
          </div>
        </div>
      </div>
  );
};

export default PartnersSection;
