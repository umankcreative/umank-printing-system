
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronDown,
  ArchiveRestore,
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
    name: 'Inventory',
    icon: <Box size={20} />,
    path: '/products',
    roles: ['admin', 'manager toko', 'admin gudang'],
    subMenu: [
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
    ],
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
    name: 'Form Management',
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
];

interface SidebarProps {
  userRole: string;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSubMenuToggle = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => item.roles.includes(userRole));
  }, [userRole]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          className="p-2 bg-white rounded-md shadow-md text-gray-500 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-3xl">UC</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                Umank Creative
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                {item.subMenu ? (
                  <>
                    <button
                      onClick={() => handleSubMenuToggle(item.name)}
                      aria-expanded={openSubMenu === item.name}
                      aria-controls={`submenu-${item.name}`}
                      role="button"
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md hover:bg-gray-100 hover:text-indigo-600 group"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 text-gray-500 group-hover:text-indigo-600">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          openSubMenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      id={`submenu-${item.name}`}
                      role="region"
                      aria-hidden={openSubMenu !== item.name}
                      className={`pl-8 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubMenu === item.name ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 group ${
                            location.pathname === subItem.path
                              ? 'bg-gray-100 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                          }`}
                        >
                          <div className="mr-3 text-gray-500 group-hover:text-indigo-600">
                            {subItem.icon}
                          </div>
                          <span className="font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 group ${
                      location.pathname === item.path
                        ? 'bg-gray-100 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                    }`}
                  >
                    <div className="mr-3 text-gray-500 group-hover:text-indigo-600">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150"
                alt="User avatar"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
