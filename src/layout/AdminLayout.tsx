import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
// import  Sidebar  from '../components/Sidebar';



const AdminLayout: React.FC= () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="z-0 mx-auto px-4 py-6">
      <Outlet />
      </main>
      {/* <footer>Admin Footer</footer> */}
    </div>
  );
};

export default AdminLayout;
