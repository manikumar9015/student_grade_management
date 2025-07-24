import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiClient from '../services/apiService';
// Import the custom alert functions
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../services/alertService';

Modal.setAppElement('#root');

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    branchId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teachersResponse, branchesResponse] = await Promise.all([
          apiClient.get('/teachers'),
          apiClient.get('/branches'),
        ]);
        setTeachers(teachersResponse.data);
        setBranches(branchesResponse.data);
      } catch (err) {
        setError('Failed to load page data.');
        showErrorAlert('Failed to load page data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const teacherData = {
      ...formData,
      branchId: parseInt(formData.branchId, 10),
    };

    if (editingTeacher) {
      delete teacherData.password;
    }

    const action = editingTeacher
      ? apiClient.put(`/teachers/${editingTeacher.id}`, teacherData)
      : apiClient.post('/teachers', teacherData);

    try {
      const response = await action;
      if (editingTeacher) {
        setTeachers(teachers.map(t => (t.id === editingTeacher.id ? response.data : t)));
        showSuccessAlert('Teacher updated successfully!');
      } else {
        setTeachers([...teachers, response.data]);
        showSuccessAlert('Teacher created successfully!');
      }
      closeModal();
    } catch (err) {
      setError('Failed to save the teacher.');
      showErrorAlert('Failed to save the teacher.');
      console.error(err);
    }
  };

  const openModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        password: '',
        branchId: teacher.branch.id || '',
      });
    } else {
      setEditingTeacher(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', branchId: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDeleteTeacher = async (teacherId) => {
    const result = await showConfirmDialog({
        title: 'Are you sure?',
        text: "You won't be able to revert this!"
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/teachers/${teacherId}`);
        setTeachers(teachers.filter(t => t.id !== teacherId));
        showSuccessAlert('The teacher has been deleted.');
      } catch (err) {
        setError('Failed to delete the teacher.');
        showErrorAlert('Failed to delete the teacher.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
          Create New
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{teacher.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.firstName} {teacher.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.branch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button onClick={() => openModal(teacher)} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteTeacher(teacher.id)} className="px-3 py-1 bg-transparent text-slate-600 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-white transition-colors cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Teacher Form" className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-auto mt-20 outline-none" overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingTeacher ? 'Edit Teacher' : 'New Teacher'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required className="w-full px-3 py-2 border rounded-md" />
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-3 py-2 border rounded-md" />
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full px-3 py-2 border rounded-md" />
                {!editingTeacher && (
                <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full px-3 py-2 border rounded-md" />
                )}
                <select name="branchId" value={formData.branchId} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md col-span-2">
                <option value="" disabled>Select a Branch</option>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
                </select>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">Save</button>
            </div>
            </form>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherListPage;