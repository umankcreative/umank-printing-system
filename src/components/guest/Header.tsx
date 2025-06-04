import React, { useState, useEffect } from 'react';
import { Menu, X, Printer } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Logo from '../Logo';
import { SparklesText } from '../ui/Sparkles-text';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Logo width={'30pt'} height={'30pt'} color={'#6B48E5'} />
          <span>
           <SparklesText text="Umank Creative" className='pl-2 text-[#6B48E5] bg-clip-text bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400' />
          </span>
        </div>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map(
              (item) => (
                <li key={item}>
                  <a
                    href={`${location.pathname}#${item.toLowerCase()}`}
                    className={`text-sm font-medium hover:text-cyan-500 transition-colors ${
                      isScrolled ? 'text-gray-800' : 'text-gray-800'
                    }`}
                  >
                    {item}
                  </a>
                </li>
              )
            )}
            <li>
              <a
                className={`text-sm font-medium hover:text-cyan-500 transition-colors ${
                  isScrolled ? 'text-gray-800' : 'text-gray-800'
                }`}
                href={'/shop'}
              >
                Shop
              </a>
            </li>
          </ul>
        </nav>

        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile menu */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <Printer className="h-6 w-6 text-cyan-500 mr-2" />
                <span className="text-xl font-bold text-gray-800">
                  Umank Creative
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-col p-4 space-y-4">
              {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-lg font-medium text-gray-800 hover:text-cyan-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
