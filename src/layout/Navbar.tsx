
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-white border-b border-gray-200 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              placeholder="Search..."
            />
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <div className="relative">
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </button>

          {/* Profile dropdown */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <div className="w-8 h-8 overflow-clip rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <img src={user?.avatar} />
            </div>
          </button>
          {isOpen && (
                    <div className="absolute right-0 top-12 w-48 py-2 bg-white rounded-md shadow-xl z-20">
                        <button
                        onClick={() => {
                          // Add your logout logic here
                          navigate('/logout');
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        Logout
                        </button>
                    </div>
                  )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
