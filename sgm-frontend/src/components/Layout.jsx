import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Grade Manager</h1>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</Link>
          <Link to="/branches" className="block px-4 py-2 rounded hover:bg-gray-700">Branches</Link>
          <Link to="/courses" className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Courses</Link>
          <Link to="/students" className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Students</Link>
          <Link to="/teachers" className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Teachers</Link>
          <Link to="/attendance" className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Attendance</Link>
          {/* We will add more links here later */}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;