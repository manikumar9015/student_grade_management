import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Layout = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    try {
      if (token) {
        const decodedUser = jwtDecode(token);
        const role = decodedUser.authorities[0].authority;
        setUser({ email: decodedUser.sub, role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setToken(null);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Grade Manager</h1>
          {user && (
            <div className="text-sm text-gray-400 mt-2">
              <p>{user.email}</p>
              <p className="font-bold">{user.role}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-2">
          <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>

          {/* Admin-only Links */}
          {user?.role === "ROLE_ADMIN" && (
            <>
              <Link to="/branches" className="block px-4 py-2 rounded hover:bg-gray-700">
                Branches
              </Link>
              <Link to="/courses" className="block px-4 py-2 rounded hover:bg-gray-700">
                Courses
              </Link>
              <Link to="/teachers" className="block px-4 py-2 rounded hover:bg-gray-700">
                Teachers
              </Link>
            </>
          )}

          {/* Admin or HOD */}
          {["ROLE_ADMIN", "ROLE_HOD"].includes(user?.role) && (
            <Link to="/students" className="block px-4 py-2 rounded hover:bg-gray-700">
              Students
            </Link>
          )}

          {/* Admin, HOD, or Teacher */}
          {["ROLE_ADMIN", "ROLE_HOD", "ROLE_TEACHER"].includes(user?.role) && (
            <Link to="/attendance" className="block px-4 py-2 rounded hover:bg-gray-700">
              Attendance
            </Link>
          )}

          {/* Student-only */}
          {user?.role === "ROLE_STUDENT" && (
            <Link to="/my-grades" className="block px-4 py-2 rounded hover:bg-gray-700">
              My Grades
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
