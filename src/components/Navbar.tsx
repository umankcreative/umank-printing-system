import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';




import {
  Users,
  UserCog,
  Home,
  Box,
  Boxes,
  ShoppingCart,
  CalendarClock,
  Settings,
  Menu,
  X,
  ArchiveRestore,
  DownloadCloud,
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  subMenu?: NavItem[];
}



const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        icon: <Home size={20} />,
        path: '/admin/',
        roles: ['admin', 'manager toko', 'admin gudang', 'kasir'],
      },
 
  {
    name: 'Bahan',
    icon: <Boxes size={20} />,
    path: '/admin/ingredients',
    roles: ['admin'],
  },
  {
    name: 'Produk',
    icon: <Box size={20} />,
    path: '/admin/products',
    roles: ['admin'],
  },
  {
    name: 'Pelanggan',
    icon: <Users size={20} />,
    path: '/admin/customers',
    roles: ['admin'],
  },


  {
    name: 'Pesanan',
    icon: <ShoppingCart size={20} />,
    path: '/admin/orders',
    roles: ['admin'],
  },

  {
    name: 'Tugas',
    icon: <CalendarClock size={20} />,
    path: '/admin/tasks',
    roles: ['admin','kasir', 'manager toko'],
  },
  {
    name: 'Users',
    icon: <UserCog size={20} />,
    path: '/admin/users',
    roles: ['admin'],
  },
  {
    name: 'Formulir',
    icon: <ArchiveRestore size={20} />,
    path: '/admin/form-management',
    roles: ['admin'],
    },
    {
        name: 'Pengaturan',
        icon: <Settings size={20} />,
        path: '/admin/settings',
        roles: ['admin'],
      },
    {
        name: 'Invoice',
        icon: <DownloadCloud size={20} />,
        path: '/admin/invoice',
        roles: ['admin'],
      },
];




const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => item.roles.includes(user?.role || 'kasir'));
  }, [user]);

  return (
    <nav className="sticky top-0 bg-purple-700 text-white shadow-md">
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
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-2 py-2 rounded-md hover:bg-purple-600 transition-colors ${location.pathname === item.path
                    ? 'bg-purple-600'
                    : 'bg-purple-700'
                  }`}
              > {item.name}
              </Link>
            ))}
            <div className="relative flex items-center">
              <div className="relative">
                  <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user?.avatar || 'https://via.placeholder.com/150'}
                      alt="User avatar"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-gray-100 capitalize">{user?.role}</p>
                    </div>
              </button>
              </div>
                  {isOpen && (
                    <div className="absolute right-0 top-12 w-48 py-2 bg-white rounded-md shadow-xl z-20">
                        <button
                        onClick={() => {
                          // Add your logout logic here
                          navigate('/admin/logout');
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
          {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors ${location.pathname === item.path
                    ? 'bg-purple-600'
                    : 'bg-purple-700'
                  }`}
              onClick={toggleMenu}
              > {item.name}
              </Link>
            ))}
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;
