import React from 'react';
import Header from '../components/guest/Header';
import Hero from '../components/guest/Hero';
import About from '../components/guest/About';
import Services from '../components/guest/Services';
import InteractiveCMYK from '../components/guest/InteractiveCMYK';
import Portfolio from '../components/guest/Portfolio';
import Testimonials from '../components/guest/Testimonials';
import Contact from '../components/guest/Contact';
import Footer from '../components/guest/Footer';
import './Guest.css';

function Guest() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <Hero />
      <About />
      <Services />
      <InteractiveCMYK />
      <Portfolio />
      <Testimonials />
      <Contact />
      {/* <Footer /> */}
    </div>
  );
}

export default Guest;
