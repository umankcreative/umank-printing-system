import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
// import  Sidebar  from '../components/Sidebar';

// interface LayoutProps {
//   children: React.ReactNode;
//   title: string;
//   userRole: string;
// }

const AdminLayout: React.FC<LayoutProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
        <Navbar userName='Luqman' userRole='admin' />
      
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* <footer>Admin Footer</footer> */}
    </div>
  );
};

export default AdminLayout;
