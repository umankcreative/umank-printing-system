import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="pt-24 pb-12 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div
            className="md:w-1/2 mb-10 md:mb-0 md:pr-8"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Printing that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400">
                Inspires
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Umank Creative delivers premium quality printing services with a
              perfect blend of creativity and precision. Transform your ideas
              into stunning printed materials.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center">
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                View Portfolio
              </button>
            </div>
          </div>
          <div
            className="md:w-1/2 relative"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Printing service in action"
                className="rounded-lg shadow-2xl object-cover"
              />
              <div
                className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-500 mr-2"></div>
                  <div className="h-3 w-3 rounded-full bg-fuchsia-500 mr-2"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
