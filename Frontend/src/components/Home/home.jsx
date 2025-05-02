import About from "../About/about";
import Features from "../Features/features";
import Partners from "../Partners/partners";  
import Footer from "../Footer/footer";
import background from '../../assets/home_bg.jpg'; // adjust path

function Home(){
    return (
      <div className="App">
        <header className="App-header">
          <h1 className='display-4'>WELCOME TO</h1>
          <h1 className='display-4 fw-bold'><strong>DEEPINSPECT!</strong></h1>
          <h3>Defect Detection and Localization</h3>
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
      </div>
    );
  }
  
  export default Home;
  