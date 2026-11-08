
import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';

import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0
  });

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [studentResponse, summaryResponse] = await Promise.all([
        API.get('/students'),
        API.get('/attendance/summary/today')
      ]);

      setStudents(studentResponse.data);

      setSummary({
        present: summaryResponse.data.present || 0,
        absent: summaryResponse.data.absent || 0,
        late: summaryResponse.data.late || 0
      });

    } catch (error) {
      console.error('Dashboard Error:', error);
      alert(
        error.response?.data?.message ||
        'Failed to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ADD OR UPDATE STUDENT
  const handleSubmit = async (formData) => {
    try {
      if (editingStudent) {
        await API.put(
          `/students/${editingStudent._id}`,
          formData
        );

        alert('Student updated successfully!');
      } else {
        await API.post('/students', formData);

        alert('Student added successfully!');
      }

      setIsOpen(false);
      setEditingStudent(null);

      await fetchDashboardData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Unable to save student.'
      );
    }
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsOpen(true);
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm(
      'Are you sure you want to delete this student?'
    )) {
      return;
    }

    try {
      await API.delete(`/students/${id}`);

      alert('Student deleted successfully!');

      await fetchDashboardData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Unable to delete student.'
      );
    }
  };

  // CLOSE STUDENT FORM
  const closeForm = () => {
    setIsOpen(false);
    setEditingStudent(null);
  };

  // SEARCH STUDENTS
  const filteredStudents = students.filter((student) =>
    [
      student.studentId,
      student.name,
      student.email,
      student.course,
      student.yearLevel
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        {/* WELCOME BANNER */}
        <section className="welcome-banner">
          <div>
            <span>ATTENDANCE MANAGEMENT SYSTEM</span>

            <h1>Manage your students with ease.</h1>

            <p>
              Monitor student records and keep your academic
              data organized.
            </p>
          </div>

          <div className="welcome-icon">
            <Users size={65} />
          </div>
        </section>

        {/* DASHBOARD STATISTICS */}
        <section className="stats-grid">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={Users}
            color="purple"
            description="Registered students"
          />

          <StatCard
            title="Present Today"
            value={summary.present}
            icon={UserCheck}
            color="green"
            description="Students present"
          />

          <StatCard
            title="Absent Today"
            value={summary.absent}
            icon={UserX}
            color="red"
            description="Students absent"
          />

          <StatCard
            title="Late Today"
            value={summary.late}
            icon={Clock}
            color="orange"
            description="Students late"
          />
        </section>

        {/* STUDENT RECORDS */}
        <section className="records-section" id="students">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>

              <p>
                Manage and organize all registered students.
              </p>
            </div>

            <div className="record-actions">

              {/* SEARCH */}
              <div className="student-search-wrapper">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="student-search"
                />
              </div>

              {/* REFRESH */}
              <button
                className="refresh-btn"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              {/* ADD STUDENT */}
              <button
                className="add-btn"
                onClick={() => {
                  setEditingStudent(null);
                  setIsOpen(true);
                }}
              >
                <Plus size={18} />
                Add Student
              </button>

            </div>
          </div>

          <StudentTable
            students={filteredStudents}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        {/* FOOTER */}
        <footer className="footer">
          © 2026 AttendEase. Smart Attendance Management System.
        </footer>
      </main>

      {/* STUDENT FORM */}
      <StudentForm
        isOpen={isOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        editingStudent={editingStudent}
      />
    </div>
  );
}

export default Dashboard;
