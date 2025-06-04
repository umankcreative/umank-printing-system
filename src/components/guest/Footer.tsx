import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Printer,
  ArrowUp,
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center mb-4">
              <Printer className="h-8 w-8 text-cyan-400 mr-2" />
              <span className="text-xl font-bold">Umank Creative</span>
            </div>
            <p className="text-gray-400 mb-6">
              Solusi cetak premium dengan kombinasi kreativitas dan presisi yang sempurna.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Portfolio', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="600">
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              {[
                'Business Cards',
                'Brochures & Flyers',
                'Packaging',
                'Posters & Banners',
                'Corporate Stationery',
                'Catalogs & Booklets',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="800">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Berlangganan newsletter kami untuk mendapatkan informasi terbaru dan penawaran terbaik.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-cyan-500 text-white px-4 py-2 rounded-r-lg hover:bg-cyan-600 transition-colors"
                >
                  Berlangganan
                </button>
              </div>
            </form>
            <p className="text-gray-500 text-sm">
              Dengan berlangganan, Anda setuju dengan Kebijakan Privasi kami dan menyetujui untuk menerima pembaruan dari perusahaan kami.
            </p>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Umank Creative. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">
              Syarat dan Ketentuan
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-colors focus:outline-none"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
