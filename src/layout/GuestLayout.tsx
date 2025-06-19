import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/guest/Header';
// import Hero from '../components/guest/Hero';
// import About from '../components/guest/About';
// import Services from '../components/guest/Services';
// import InteractiveCMYK from '../components/guest/InteractiveCMYK';
// import Portfolio from '../components/guest/Portfolio';
// import Testimonials from '../components/guest/Testimonials';
// import Contact from '../components/guest/Contact';
import Footer from '../components/guest/Footer';

// import './Guest.css';

function GuestLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>

      {/* <footer>
        <Footer />
      </footer> */}

      {/* <Hero />
      <About />
      <Services />
      <InteractiveCMYK />
      <Portfolio />
      <Testimonials />
      <Contact /> */}
    </div>
  );
}

export default GuestLayout;
