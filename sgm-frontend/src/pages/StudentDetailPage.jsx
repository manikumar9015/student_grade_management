import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import apiClient from '../services/apiService';
// Import our custom alert service
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../services/alertService';

Modal.setAppElement('#root');

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [currentGradingInfo, setCurrentGradingInfo] = useState(null);
  const [gradeFormData, setGradeFormData] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [studentResponse, coursesResponse] = await Promise.all([
          apiClient.get(`/students/${id}`),
          apiClient.get('/courses'),
        ]);
        setStudent(studentResponse.data);
        setAllCourses(coursesResponse.data);
      } catch (err) {
        setError('Failed to load student details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const availableCourses = useMemo(() => {
    if (!student) return [];
    const enrolledCourseIds = new Set(student.courses.map(c => c.id));
    return allCourses.filter(course => !enrolledCourseIds.has(course.id));
  }, [student, allCourses]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    try {
      const response = await apiClient.post(`/students/${student.id}/courses/${selectedCourseId}`);
      setStudent(response.data);
      closeEnrollModal();
      showSuccessAlert('Student enrolled successfully!');
    } catch (err) {
      setError('Failed to enroll student.');
      showErrorAlert('Failed to enroll student.');
      console.error(err);
    }
  };

  const handleUnenroll = async (courseId) => {
    const result = await showConfirmDialog({
        title: 'Are you sure?',
        text: "This will unenroll the student from the course."
    });

    if (result.isConfirmed) {
      try {
        const response = await apiClient.delete(`/students/${student.id}/courses/${courseId}`);
        setStudent(response.data);
        showSuccessAlert('Student unenrolled successfully.');
      } catch (err) {
        setError('Failed to unenroll student.');
        showErrorAlert('Failed to unenroll student.');
        console.error(err);
      }
    }
  };

  const openEnrollModal = () => setIsEnrollModalOpen(true);
  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
    setSelectedCourseId('');
  };

  const getSemester = (studentYear) => {
    const isOddSemester = new Date().getMonth() >= 7;
    return studentYear * 2 - (isOddSemester ? 1 : 0);
  };

  const openGradeModal = async (course) => {
    setCurrentGradingInfo({ student, course });
    const semester = getSemester(student.year);
    try {
      const response = await apiClient.get(`/grades/student/${student.id}/course/${course.id}/semester/${semester}`);
      setGradeFormData(response.data);
    } catch (err) {
      setGradeFormData({}); 
      console.log("No existing grades found, starting fresh.");
    }
    setIsGradeModalOpen(true);
  };

  const closeGradeModal = () => setIsGradeModalOpen(false);

  const handleGradeFormChange = (e) => {
    const { name, value } = e.target;
    setGradeFormData({ ...gradeFormData, [name]: value === '' ? null : parseFloat(value) });
  };

  // This function is now updated to use the custom success alert
  const handleGradeFormSubmit = async (e) => {
    e.preventDefault();
    const { student, course } = currentGradingInfo;
    const semester = getSemester(student.year);
    try {
      await apiClient.post(`/grades/student/${student.id}/course/${course.id}/semester/${semester}`, gradeFormData);
      closeGradeModal();
      showSuccessAlert('Grades saved successfully!');
    } catch (err) {
      setError('Failed to save grades.');
      showErrorAlert('Failed to save grades.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!student) return <div className="text-center p-4">Student not found.</div>;

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold">{student.firstName} {student.lastName}</h1>
        <p className="text-gray-600">USN: {student.usn}</p>
        <p className="text-gray-600">Email: {student.email}</p>
        <p className="text-gray-600">Branch: {student.branch.name}</p>
        <p className="text-gray-600">Year: {student.year} | Section: {student.section}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Enrolled Courses</h2>
          <button onClick={openEnrollModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
            Enroll in Course
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          {student.courses.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {student.courses.map(course => (
                <li key={course.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-semibold">{course.courseName}</p>
                    <p className="text-sm text-gray-500">{course.courseCode} - {course.credits} Credits</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openGradeModal(course)} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                      Manage Grades
                    </button>
                    <button onClick={() => handleUnenroll(course.id)} className="px-3 py-1 bg-transparent text-slate-600 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-white transition-colors cursor-pointer">
                      Unenroll
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-gray-500">This student is not enrolled in any courses yet.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isEnrollModalOpen} onRequestClose={closeEnrollModal} contentLabel="Enroll Student" className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto mt-20 outline-none" overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Enroll in New Course</h2>
          <form onSubmit={handleEnrollment}>
            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required className="w-full px-3 py-2 border rounded-md">
              <option value="" disabled>Select a course to enroll</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>{course.courseName} ({course.courseCode})</option>
              ))}
            </select>
            <div className="flex justify-end space-x-4 mt-6">
              <button type="button" onClick={closeEnrollModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">Enroll</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isGradeModalOpen} onRequestClose={closeGradeModal} contentLabel="Manage Grades" className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto mt-20 outline-none" overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Manage Grades for {currentGradingInfo?.course.courseName}</h2>
          <form onSubmit={handleGradeFormSubmit} className="space-y-4">
            <p className="text-lg font-semibold col-span-2">Theory Internals</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">MSE-1</label>
                <input name="mse1" type="number" step="0.5" value={gradeFormData.mse1 || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">MSE-2</label>
                <input name="mse2" type="number" step="0.5" value={gradeFormData.mse2 || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <p className="text-lg font-semibold col-span-2 pt-4">Tasks</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task 1</label>
                <input name="task1" type="number" step="0.5" value={gradeFormData.task1 || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Task 2</label>
                <input name="task2" type="number" step="0.5" value={gradeFormData.task2 || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Task 3</label>
                <input name="task3" type="number" step="0.5" value={gradeFormData.task3 || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <p className="text-lg font-semibold col-span-2 pt-4">Lab Internals</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">Record Marks</label>
                <input name="recordMarks" type="number" step="0.5" value={gradeFormData.recordMarks || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conduction Marks</label>
                <input name="conductionMarks" type="number" step="0.5" value={gradeFormData.conductionMarks || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">MSE (Lab)</label>
                <input name="mseLab" type="number" step="0.5" value={gradeFormData.mseLab || ''} onChange={handleGradeFormChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={closeGradeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">Save Grades</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetailPage;