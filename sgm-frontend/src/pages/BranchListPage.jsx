import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiClient from '../services/apiService';
// Import the custom alert functions
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../services/alertService';

Modal.setAppElement('#root');

const BranchListPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBranchName, setCurrentBranchName] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/branches');
        setBranches(response.data);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setError('Failed to load branches.');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const action = editingBranch
      ? apiClient.put(`/branches/${editingBranch.id}`, { name: currentBranchName })
      : apiClient.post('/branches', { name: currentBranchName });

    try {
      const response = await action;
      if (editingBranch) {
        setBranches(branches.map(b => (b.id === editingBranch.id ? response.data : b)));
        showSuccessAlert('Branch updated successfully!');
      } else {
        setBranches([...branches, response.data]);
        showSuccessAlert('Branch created successfully!');
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save branch:", err);
      showErrorAlert('Failed to save the branch.');
    }
  };

  // This function is now updated to use the custom confirmation dialog
  const handleDeleteBranch = async (branchId) => {
    const result = await showConfirmDialog({
      title: 'Are you sure?',
      text: "You won't be able to revert this!"
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/branches/${branchId}`);
        setBranches(branches.filter(b => b.id !== branchId));
        showSuccessAlert('The branch has been deleted.');
      } catch (err) {
        console.error("Failed to delete branch:", err);
        showErrorAlert('Failed to delete the branch.');
      }
    }
  };

  const openModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setCurrentBranchName(branch.name || '');
    } else {
      setEditingBranch(null);
      setCurrentBranchName('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setCurrentBranchName('');
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Branches</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{branch.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{branch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    onClick={() => openModal(branch)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="px-3 py-1 bg-transparent text-slate-600 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={editingBranch ? "Edit Branch" : "Create New Branch"}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/50"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingBranch ? "Edit Branch" : "New Branch"}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              value={currentBranchName}
              onChange={(e) => setCurrentBranchName(e.target.value)}
              placeholder="e.g., Computer Science"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BranchListPage;