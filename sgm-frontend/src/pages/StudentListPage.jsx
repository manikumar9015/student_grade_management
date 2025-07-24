import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import apiClient from "../services/apiService";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]); // State to hold the list of branches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    usn: "",
    year: "",
    section: "",
    branchId: "",
  });

  // useEffect to fetch both students and branches when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both sets of data in parallel
        const [studentsResponse, branchesResponse] = await Promise.all([
          apiClient.get("/students"),
          apiClient.get("/branches"),
        ]);
        setStudents(studentsResponse.data);
        setBranches(branchesResponse.data);
      } catch (err) {
        setError("Failed to load page data.");
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
    const studentData = {
      ...formData,
      year: parseInt(formData.year, 10),
      branchId: parseInt(formData.branchId, 10),
    };

    // Don't send the password on an update request
    if (editingStudent) {
      delete studentData.password;
    }

    const action = editingStudent
      ? apiClient.put(`/students/${editingStudent.id}`, studentData)
      : apiClient.post("/students", studentData);

    try {
      const response = await action;
      if (editingStudent) {
        // Find and update the student in the list
        setStudents(
          students.map((s) => (s.id === editingStudent.id ? response.data : s))
        );
      } else {
        // Add the new student to the list
        setStudents([...students, response.data]);
      }
      closeModal();
    } catch (err) {
      setError("Failed to save the student.");
      console.error(err);
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        usn: student.usn || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        password: "", // Password is not edited here
        year: student.year || "",
        section: student.section || "",
        branchId: student.branch.id || "",
      });
    } else {
      setEditingStudent(null);
      setFormData({
        usn: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        year: "",
        section: "",
        branchId: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await apiClient.delete(`/students/${studentId}`);
        setStudents(students.filter((s) => s.id !== studentId));
      } catch (err) {
        setError("Failed to delete the student.");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          Create New
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                USN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{student.usn}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/students/${student.id}`}
                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                  >
                    {student.firstName} {student.lastName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.branch.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.section}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    onClick={() => openModal(student)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
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
        contentLabel="Student Form"
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">
            {editingStudent ? "Edit Student" : "New Student"}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="usn"
                value={formData.usn}
                onChange={handleInputChange}
                placeholder="USN"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              {!editingStudent && (
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
              <input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="Year"
                required
                className="w-null px-3 py-2 border rounded-md"
              />
              <input
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                placeholder="Section"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="" disabled>
                  Select a Branch
                </option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
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
        </div>
      </Modal>
    </div>
  );
};

export default StudentListPage;
