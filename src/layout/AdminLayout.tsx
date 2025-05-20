import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header>
        <Navbar />
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* <footer>Admin Footer</footer> */}
    </div>
  );
};

export default AdminLayout;
