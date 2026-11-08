
import { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  RefreshCw,
  Trash2,
  Pencil,
  X
} from 'lucide-react';

import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const initialForm = {
    student: '',
    subject: '',
    semester: 'First Semester',
    academicYear: '2026-2027',
    grade: '',
    remarks: 'Passed'
  };

  const [formData, setFormData] = useState(initialForm);

  // FETCH GRADES AND STUDENTS
  const fetchData = async () => {
    try {
      setLoading(true);

      const [gradeResponse, studentResponse] = await Promise.all([
        API.get('/grades'),
        API.get('/students')
      ]);

      setGrades(gradeResponse.data);
      setStudents(studentResponse.data);

    } catch (error) {
      console.error('Grades Error:', error);
      alert(error.response?.data?.message || 'Failed to load grades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEMESTER COUNTS
  const firstSemester = grades.filter(
    item => item.semester === 'First Semester'
  ).length;

  const secondSemester = grades.filter(
    item => item.semester === 'Second Semester'
  ).length;

  const passedCount = grades.filter(
    item => item.remarks === 'Passed'
  ).length;

  // OPEN ADD FORM
  const openAddForm = () => {
    setEditingGrade(null);
    setFormData(initialForm);
    setIsOpen(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (item) => {
    setEditingGrade(item);

    setFormData({
      student: item.student?._id || '',
      subject: item.subject,
      semester: item.semester,
      academicYear: item.academicYear,
      grade: item.grade,
      remarks: item.remarks
    });

    setIsOpen(true);
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // SAVE GRADE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericGrade = Number(formData.grade);

    if (numericGrade < 1 || numericGrade > 5) {
      alert('Grade must be between 1.00 and 5.00.');
      return;
    }

    try {
      const payload = {
        ...formData,
        grade: numericGrade
      };

      if (editingGrade) {
        await API.put(`/grades/${editingGrade._id}`, payload);
        alert('Grade updated successfully!');
      } else {
        await API.post('/grades', payload);
        alert('Grade added successfully!');
      }

      setIsOpen(false);
      setEditingGrade(null);
      setFormData(initialForm);

      await fetchData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to save grade.'
      );
    }
  };

  // DELETE GRADE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) {
      return;
    }

    try {
      await API.delete(`/grades/${id}`);
      alert('Grade deleted successfully!');
      await fetchData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to delete grade.'
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="grades-page">

          {/* PAGE HEADER */}
          <div className="grades-header">
            <div>
              <h2>Student Grades</h2>
              <p>Manage student academic performance and semester records.</p>
            </div>

            <div className="record-actions">
              <button
                className="refresh-btn"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button className="add-btn" onClick={openAddForm}>
                <Plus size={17} />
                Add Grade
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grades-summary">

            <div className="stat-card">
              <div className="stat-top">
                <p>Total Grade Records</p>
                <div className="stat-icon purple">
                  <GraduationCap size={21} />
                </div>
              </div>
              <h2>{grades.length}</h2>
              <span className="stat-description">All recorded grades</span>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>First Semester</p>
                <div className="stat-icon purple">
                  <GraduationCap size={21} />
                </div>
              </div>
              <h2>{firstSemester}</h2>
              <span className="stat-description">First semester records</span>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>Second Semester</p>
                <div className="stat-icon green">
                  <GraduationCap size={21} />
                </div>
              </div>
              <h2>{secondSemester}</h2>
              <span className="stat-description">Second semester records</span>
            </div>

          </div>

          {/* GRADES TABLE */}
          <section className="records-section">
            <div className="section-heading">
              <div>
                <h2>Academic Grade Records</h2>
                <p>View, update, and manage student grades.</p>
              </div>
            </div>

            <div className="grades-table-container">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>SUBJECT</th>
                    <th>SEMESTER</th>
                    <th>ACADEMIC YEAR</th>
                    <th>GRADE</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        Loading grades...
                      </td>
                    </tr>
                  ) : grades.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No grade records found. Click Add Grade to begin.
                      </td>
                    </tr>
                  ) : (
                    grades.map((item) => (
                      <tr key={item._id}>
                        <td className="student-name">
                          {item.student?.name || 'Unknown Student'}
                        </td>

                        <td>{item.subject}</td>
                        <td>{item.semester}</td>
                        <td>{item.academicYear}</td>

                        <td className="grade-value">
                          {Number(item.grade).toFixed(2)}
                        </td>

                        <td>
                          <span className={`grade-remarks ${
                            item.remarks === 'Passed'
                              ? 'grade-passed'
                              : 'grade-failed'
                          }`}>
                            {item.remarks}
                          </span>
                        </td>

                        <td>
                          <div className="grade-actions">
                            <button
                              className="grade-edit"
                              onClick={() => openEditForm(item)}
                              title="Edit Grade"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              className="grade-delete"
                              onClick={() => handleDelete(item._id)}
                              title="Delete Grade"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ADD / EDIT GRADE MODAL */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="student-modal">

            <div className="modal-header">
              <div>
                <h2>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</h2>
                <p>Enter the student's academic information.</p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Student</label>
              <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>

                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.studentId} - {student.name}
                  </option>
                ))}
              </select>

              <label>Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject name"
                required
              />

              <label>Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>

              <label>Academic Year</label>
              <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Example: 2026-2027"
                required
              />

              <label>Grade (1.00 - 5.00)</label>
              <input
                type="number"
                name="grade"
                min="1"
                max="5"
                step="0.01"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Example: 1.50"
                required
              />

              <label>Remarks</label>
              <select
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                required
              >
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingGrade ? 'Update Grade' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Grades;
