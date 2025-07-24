import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiClient from '../services/apiService';
// Import the custom alert functions
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../services/alertService';

Modal.setAppElement('#root');

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal and its form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    credits: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      credits: parseInt(formData.credits, 10),
    };

    const action = editingCourse
      ? apiClient.put(`/courses/${editingCourse.id}`, courseData)
      : apiClient.post('/courses', courseData);

    try {
      const response = await action;
      if (editingCourse) {
        setCourses(courses.map(c => (c.id === editingCourse.id ? response.data : c)));
        showSuccessAlert('Course updated successfully!');
      } else {
        setCourses([...courses, response.data]);
        showSuccessAlert('Course created successfully!');
      }
      closeModal();
    } catch (err) {
      setError('Failed to save the course.');
      showErrorAlert('Failed to save the course.');
      console.error(err);
    }
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseName: course.courseName || '',
        courseCode: course.courseCode || '',
        credits: course.credits || '',
      });
    } else {
      setEditingCourse(null);
      setFormData({ courseName: '', courseCode: '', credits: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // This function is now updated to use the custom confirmation dialog
  const handleDeleteCourse = async (courseId) => {
    const result = await showConfirmDialog({
      title: 'Are you sure?',
      text: "You won't be able to revert this!"
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/courses/${courseId}`);
        setCourses(courses.filter(c => c.id !== courseId));
        showSuccessAlert('The course has been deleted.');
      } catch (err) {
        setError('Failed to delete the course.');
        showErrorAlert('Failed to delete the course.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          Create New
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Course Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{course.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.courseCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => openModal(course)} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-1 bg-transparent text-slate-600 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-white transition-colors cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Course Form" className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto mt-20 outline-none" overlayClassName="fixed inset-0 bg-black/50">
        <h2 className="text-xl font-bold mb-4">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input name="courseName" value={formData.courseName} onChange={handleInputChange} placeholder="e.g., Introduction to Java" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input name="courseCode" value={formData.courseCode} onChange={handleInputChange} placeholder="e.g., CS101" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credits</label>
            <input name="credits" type="number" value={formData.credits} onChange={handleInputChange} placeholder="e.g., 4" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseListPage;