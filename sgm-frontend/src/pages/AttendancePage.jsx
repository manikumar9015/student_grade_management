import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { showSuccessAlert, showErrorAlert } from '../services/alertService';

const AttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch only courses on initial load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRes = await apiClient.get('/courses');
        setCourses(coursesRes.data);
      } catch (error) {
        showErrorAlert('Failed to load courses.');
        console.error('Failed to load courses', error);
      }
    };
    fetchCourses();
  }, []);

  const handleStudentSearch = async () => {
    if (searchQuery.trim() === '') return;
    setHasSearched(true);
    try {
      const response = await apiClient.get(`/students/search?query=${searchQuery}`);
      setSearchResults(response.data);
      setSelectedStudent(null); // Clear previous selection
    } catch (error) {
      showErrorAlert('Failed to search for students.');
    }
  };

  const handleFetchAttendance = async () => {
    if (!selectedStudent || !selectedCourse) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/attendance/student/${selectedStudent.id}/course/${selectedCourse}`);
      setAttendanceRecords(response.data);
    } catch (error) {
      setAttendanceRecords([]); // Clear old records on error
      showErrorAlert('Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(`${student.firstName} ${student.lastName} (${student.usn})`);
    setSearchResults([]); // Hide search results after selection
    setHasSearched(false); // Reset search tracker
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Attendance</h1>

      {/* Selection Area */}
      <div className="p-4 bg-white shadow-md rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Student Search Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Search Student (by Name or USN)</label>
            <div className="flex space-x-2 mt-1">
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter name or USN..."
                />
                <button onClick={handleStudentSearch} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">Search</button>
            </div>
            {hasSearched && (
              <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(student => (
                    <li 
                      key={student.id} 
                      onClick={() => handleSelectStudent(student)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {student.firstName} {student.lastName} ({student.usn})
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No results found.</li>
                )}
              </ul>
            )}
          </div>
          
          {/* Course Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Course</label>
            <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md cursor-pointer"
            >
            <option value="">Select a Course</option>
            {courses.map(course => (
                <option key={course.id} value={course.id}>
                {course.courseName}
                </option>
            ))}
            </select>
          </div>

          <button
            onClick={handleFetchAttendance}
            disabled={!selectedStudent || !selectedCourse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 cursor-pointer"
          >
            Fetch/Manage Attendance
          </button>
        </div>
      </div>
      
      {/* We will add the attendance marking UI here in the next step */}
      
    </div>
  );
};

export default AttendancePage;