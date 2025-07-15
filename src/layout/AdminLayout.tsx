import React from 'react';
// import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';



const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user?.role ?? ''} userName={user?.name ?? ''} />
      <div className="w-full md:ml-72">
        <Navbar title="Admin Dashboard" />
        {/* Main content area */}

        <main className="flex-1 ml-0 mt-20 print:ml-0 overflow-y-auto m-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
