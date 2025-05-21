import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400">
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="30.000000pt"
                height="30.000000pt"
                viewBox="0 0 124.000000 109.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,109.000000) scale(0.100000,-0.100000)"
                  fill="#fff"
                  stroke="none"
                >
                  <path
                    d="M565 1069 c-146 -14 -277 -87 -379 -212 -36 -44 -41 -47 -87 -47
l-49 0 0 -78 c0 -44 -9 -123 -21 -178 -11 -55 -19 -118 -16 -142 6 -53 44
-109 105 -153 26 -18 76 -63 112 -99 115 -115 228 -160 404 -160 90 0 123 5
177 24 128 45 254 154 313 270 20 39 35 56 54 61 69 17 83 84 32 145 -23 25
-30 44 -30 75 0 105 -57 230 -146 325 -122 129 -280 186 -469 169z m200 -44
c32 -9 86 -30 119 -48 59 -31 176 -135 176 -156 0 -13 -63 23 -112 64 -152
128 -368 151 -551 59 -29 -15 -82 -57 -119 -96 -52 -53 -71 -67 -83 -60 -35
19 94 146 203 201 99 50 253 65 367 36z m-19 -112 c27 -20 75 -59 107 -86 l57
-49 18 22 c17 21 19 22 57 6 42 -18 81 -49 96 -79 8 -14 4 -25 -15 -48 -14
-17 -26 -36 -26 -43 0 -7 36 -55 80 -107 44 -52 80 -100 80 -106 0 -21 -50
-27 -116 -14 -98 20 -107 13 -145 -114 -39 -130 -97 -174 -226 -175 -63 0 -75
3 -104 27 -31 26 -72 100 -64 114 3 3 36 4 75 1 119 -8 198 38 245 144 26 59
45 73 115 81 42 5 50 9 50 27 0 60 -151 242 -262 316 -50 33 -69 40 -109 40
-59 0 -157 -35 -263 -96 -44 -24 -80 -43 -82 -42 -1 2 25 27 59 56 66 56 263
162 301 162 13 0 45 -17 72 -37z m-36 -122 c31 -22 36 -44 15 -65 -47 -47
-192 17 -152 66 7 9 19 18 27 21 24 9 83 -3 110 -22z m-478 -67 c28 -14 73
-49 100 -76 27 -28 50 -49 52 -47 1 2 10 16 19 32 16 25 22 27 90 27 136 -1
276 -45 299 -95 14 -31 -25 -201 -54 -230 -31 -33 -126 -27 -208 11 -96 45
-134 83 -165 163 -36 96 -120 177 -211 205 -19 6 -22 2 -27 -41 -2 -27 -10
-87 -18 -134 -11 -78 -11 -91 5 -132 21 -56 59 -82 159 -108 87 -23 87 -23 87
-5 0 20 -67 76 -90 76 -11 0 -20 5 -20 10 0 6 14 10 32 10 31 0 31 0 13 20
-10 12 -34 30 -54 42 -41 26 -26 36 20 13 l32 -17 -34 59 c-18 32 -43 75 -56
95 -30 49 -29 61 2 23 50 -61 118 -170 158 -254 l40 -86 13 32 c21 51 31 46
31 -15 0 -34 7 -70 16 -89 23 -43 22 -43 -20 -22 -21 10 -72 25 -113 34 -100
21 -170 54 -219 105 -54 56 -59 88 -32 214 12 55 21 127 21 160 l0 59 41 -7
c22 -4 64 -18 91 -32z m915 -121 l6 -48 -26 31 c-29 34 -34 63 -15 82 16 16
26 -2 35 -65z m-27 -252 c0 -16 -74 -129 -108 -165 -170 -178 -461 -212 -667
-78 -33 22 -73 53 -89 70 l-29 31 39 -10 c21 -6 48 -19 59 -28 58 -51 145 -87
242 -101 79 -11 232 9 289 38 52 27 174 156 203 214 17 36 26 45 41 41 11 -3
20 -8 20 -12z"
                  />
                  <path
                    d="M423 618 c-33 -43 -24 -75 26 -87 102 -26 98 -27 105 24 5 31 3 51
-5 61 -15 18 -112 19 -126 2z"
                  />
                  <path
                    d="M596 588 c-9 -12 -16 -37 -16 -54 0 -30 2 -32 59 -43 78 -15 91 -9
91 44 0 41 -2 44 -40 59 -54 22 -76 20 -94 -6z"
                  />
                  <path
                    d="M408 515 c-20 -21 67 -125 104 -125 7 0 28 65 28 87 0 16 -120 50
-132 38z"
                  />
                  <path
                    d="M566 464 c-11 -28 -6 -81 8 -93 7 -6 33 -14 58 -17 38 -5 49 -3 67
15 24 24 27 53 7 71 -13 10 -107 39 -127 40 -4 0 -10 -7 -13 -16z"
                  />
                </g>
              </svg>

              <span className="font-bold text-xl ml-2">Umank Printing System</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/admin"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/ingredients"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Bahan
            </Link>
            <Link
              to="/admin/products"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Produk
            </Link>
            <Link
              to="/admin/orders"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Order
            </Link>
            <Link
              to="/admin/tasks"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Todo
            </Link>
            <Link
              to="/admin/users"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Users
            </Link>
            {/* <Link to="/timeline" className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Timeline
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-purple-800 pb-3 px-4">
          <Link
            to="/admin"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/ingredients"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Bahan
          </Link>
          <Link
            to="/admin/products"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Produk
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Order
          </Link>
          <Link
            to="/admin/tasks"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Todo
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Users
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
