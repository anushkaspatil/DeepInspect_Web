import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import feature1 from '../../assets/feature1.avif';
import feature2 from '../../assets/feature2.avif';
import feature3 from '../../assets/feature3.avif';
import { Container } from 'react-bootstrap';

function Features() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  const slides = [
    {
      img: feature1,
      title: "Performance Dashboard",
      desc: "Track system performance and inspection stats in real-time.",
    },
    {
      img: feature2,
      title: "Real-Time Defect Detection",
      desc: "Spot product flaws instantly using ML-integrated cameras.",
    },
    {
      img: feature3,
      title: "Smart Alerts",
      desc: "Automatic alerts for missing safety gear or defects.",
    },
  ];

  return (
    <div className=" py-5">
      {/* Centered Features Heading */}
      <div className="text-center mb-3">
        <h1 className="fw-bold">Features</h1>
      </div>

      <Container className='container-fluid'>
        <div className="mx-auto" >
          <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} fade>
            {slides.map((slide, i) => (
              <Carousel.Item key={i}>
                <div className="position-relative">
                  {/* Image */}
                  <img
                    className="d-block w-100 rounded"
                    src={slide.img}
                    alt={`Slide ${i}`}
                    style={{ height: '500px', objectFit: 'cover' }}
                  />

                  {/* Custom Indicators */}
                  <div
                    className="position-absolute start-50 translate-middle-x d-flex gap-2"
                    style={{ bottom: '70px', zIndex: 2 }}
                  >
                    {slides.map((_, j) => (
                      <div
                        key={j}
                        onClick={() => setIndex(j)}
                        className={`rounded-circle ${index === j ? 'bg-white' : 'bg-secondary'}`}
                        style={{
                          width: 12,
                          height: 12,
                          opacity: 0.8,
                          cursor: 'pointer',
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Text Strip at Bottom */}
                  <div
                    className="position-absolute bottom-0 w-100 text-white px-4 py-2 text-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                  >
                    <h5 className="mb-1">{slide.title}</h5>
                    <p className="mb-0">{slide.desc}</p>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Container>
    </div>
  );
}

export default Features;
