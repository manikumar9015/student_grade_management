import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import BranchListPage from './pages/BranchListPage';
import CourseListPage from './pages/CourseListPage';
import StudentListPage from './pages/StudentListPage';
import TeacherListPage from './pages/TeacherListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

// A placeholder for our main dashboard page
const DashboardPage = () => (
  <div>
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p>Welcome to the main dashboard.</p>
  </div>
);

// A component that protects routes from unauthorized access
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  
  return (
    <Routes>
      {/* 1. Public Route for Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Protected Parent Route for the Main Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* 3. Child routes that will render inside the Layout's <Outlet> */}
        <Route index element={<DashboardPage />} />
        <Route path="branches" element={<BranchListPage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/:id" element={<StudentDetailPage />} />
        <Route path="teachers" element={<TeacherListPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        {/* We can add more pages like "/courses" here later */}
        {/* <Route path="courses" element={<CourseListPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;