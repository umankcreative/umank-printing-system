import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

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
              <Logo />

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
            <Link to="/admin/settings" className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center">
              Setting
            </Link>
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
          <Link
            to="/admin/settings"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Setting
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
