
import { useEffect, useState } from 'react';
import { ClipboardCheck, RefreshCw } from 'lucide-react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const [studentResponse, attendanceResponse] = await Promise.all([
        API.get('/students'),
        API.get('/attendance')
      ]);

      setStudents(studentResponse.data);

      const today = new Date().toDateString();

      setAttendance(
        attendanceResponse.data.filter(
          item => new Date(item.date).toDateString() === today
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load attendance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAttendance = async (studentId) => {
    const status = statuses[studentId];

    if (!status) {
      alert('Please select an attendance status.');
      return;
    }

    try {
      await API.post('/attendance', {
        student: studentId,
        status
      });

      alert('Attendance recorded successfully!');
      setStatuses(prev => ({ ...prev, [studentId]: '' }));
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to record attendance.');
    }
  };

  const getStatus = (studentId) => {
    return attendance.find(
      item => item.student?._id === studentId
    )?.status;
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="records-section">
          <div className="section-heading">
            <div>
              <h2>Attendance Management</h2>
              <p>Record and monitor today's student attendance.</p>
            </div>

            <button className="refresh-btn" onClick={fetchData}>
              <RefreshCw size={17} /> Refresh
            </button>
          </div>

          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT NAME</th>
                  <th>COURSE</th>
                  <th>STATUS</th>
                  <th>MARK ATTENDANCE</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading attendance...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map(student => {
                    const currentStatus = getStatus(student._id);

                    return (
                      <tr key={student._id}>
                        <td>{student.studentId}</td>
                        <td className="student-name">{student.name}</td>
                        <td>{student.course}</td>
                        <td>
                          {currentStatus ? (
                            <span className={`attendance-badge ${currentStatus.toLowerCase()}`}>
                              {currentStatus}
                            </span>
                          ) : (
                            <span className="attendance-badge unmarked">
                              Not Marked
                            </span>
                          )}
                        </td>
                        <td>
                          {currentStatus ? (
                            <span>Recorded</span>
                          ) : (
                            <div className="attendance-actions">
                              <select
                                value={statuses[student._id] || ''}
                                onChange={e =>
                                  setStatuses(prev => ({
                                    ...prev,
                                    [student._id]: e.target.value
                                  }))
                                }
                              >
                                <option value="">Select status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                              </select>

                              <button
                                className="add-btn"
                                onClick={() => markAttendance(student._id)}
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          © 2026 AttendEase. Smart Attendance Management System.
        </footer>
      </main>
    </div>
  );
}

export default Attendance;
