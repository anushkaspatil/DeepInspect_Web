import React from "react";
import About from "../About/about";
import Features from "../Features/features";
import Partners from "../Partners/partners";
import Footer from "../Footer/footer";
import Navbar from "../Navbar/nav";
import './home.css';
import backgroundVideo from '../../assets/home_page_vid.mp4';

function Home() {
  return (
    <div className="home-wrapper">
      <Navbar />

      <header className="hero-section">
        <video autoPlay loop muted className="bg-video">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <div className="overlay-background">
            <h1 className='headline'>WELCOME TO</h1>
            <h1 className='brand'>DEEPINSPECT!</h1>
            <h3 className='tagline'>Defect Detection and Localization</h3>
          </div>
        </div>
      </header>

      <section id="about">
        <About />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="partners">
        <Partners />
      </section>

      <Footer />
    </div>
  );
}

export default Home;
