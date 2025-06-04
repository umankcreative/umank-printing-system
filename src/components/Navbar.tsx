import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        roles: ['admin'],
      },
 
  {
    name: 'Ingredients',
    icon: <Boxes size={20} />,
    path: '/admin/ingredients',
    roles: ['admin'],
  },
  {
    name: 'Products',
    icon: <Box size={20} />,
    path: '/admin/products',
    roles: ['admin'],
  },
  {
    name: 'Customers',
    icon: <Users size={20} />,
    path: '/admin/customers',
    roles: ['admin'],
  },


  {
    name: 'Orders',
    icon: <ShoppingCart size={20} />,
    path: '/admin/orders',
    roles: ['admin'],
  },

  {
    name: 'Todo',
    icon: <CalendarClock size={20} />,
    path: '/admin/tasks',
    roles: ['admin'],
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
        name: 'Settings',
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


  // interface SidebarProps {
  //   userRole: string;
  //   userName: string;
  // }


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // const filteredNavigation = useMemo(() => {
  //   return navigation.filter((item) => item.roles.includes(userRole));
  // }, [userRole]);

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
            {navigation.map((item) => (
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
            {/* <Link
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
              to="/admin/customers"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Pelanggan
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
            <Link
              to="/admin/form-management"
              className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              Form Management
            </Link>
            <Link to="/admin/settings" className="px-3 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center">
              Setting
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
            to="/admin/customers"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Pelanggan
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
            to="/admin/form-management"
            className="block px-3 py-2 rounded-md hover:bg-purple-600 transition-colors"
            onClick={toggleMenu}
          >
            Form Management
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
