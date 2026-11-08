
import { useEffect, useState } from 'react';
import { RefreshCw, ClipboardList } from 'lucide-react';

import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get('/attendance');
      setRecords(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredRecords = records.filter(record =>
    [
      record.student?.studentId,
      record.student?.name,
      record.student?.course,
      record.status
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

        <section className="records-section">
          <div className="section-heading">
            <div>
              <h2>Attendance History</h2>
              <p>View previously recorded student attendance.</p>
            </div>

            <button className="refresh-btn" onClick={fetchHistory}>
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          <div className="student-search-wrapper history-search">
            <ClipboardList size={17} />
            <input
              className="student-search"
              placeholder="Search attendance records..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT NAME</th>
                  <th>COURSE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No attendance history found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record._id}>
                      <td>{record.student?.studentId || 'N/A'}</td>
                      <td className="student-name">
                        {record.student?.name || 'Deleted Student'}
                      </td>
                      <td>{record.student?.course || 'N/A'}</td>
                      <td>
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`attendance-badge ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
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

export default AttendanceHistory;