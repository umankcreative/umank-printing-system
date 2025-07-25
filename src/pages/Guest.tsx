import React from 'react';
import Hero from '../components/guest/Hero';
import About from '../components/guest/About';
import Services from '../components/guest/Services';
import InteractiveCMYK from '../components/guest/InteractiveCMYK';
import Portfolio from '../components/guest/Portfolio';
import Testimonials from '../components/guest/Testimonials';
import Contact from '../components/guest/Contact';

import './Guest.css';
import { Gallery } from '../components/guest/Gallery';

function Guest() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <Hero />
      <About />
      <Services />
      <InteractiveCMYK />
      <Gallery />
      <Portfolio />
      <Testimonials />
      <Contact />
      {/* <Footer /> */}
    </div>
  );
}

export default Guest;
