
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    course: '',
    day: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  // GET ALL SCHEDULES
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await API.get('/schedules');
      setSchedules(response.data);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load schedules.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      subject: '',
      course: '',
      day: '',
      startTime: '',
      endTime: '',
      room: ''
    });

    setEditId(null);
    setShowForm(false);
  };

  // ADD OR UPDATE SCHEDULE
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      if (editId) {
        await API.put(`/schedules/${editId}`, formData);
        setMessage('Schedule updated successfully!');
      } else {
        await API.post('/schedules', formData);
        setMessage('Schedule added successfully!');
      }

      resetForm();
      fetchSchedules();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to save schedule.'
      );
    }
  };

  // EDIT SCHEDULE
  const handleEdit = (schedule) => {
    setFormData({
      subject: schedule.subject,
      course: schedule.course,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room
    });

    setEditId(schedule._id);
    setShowForm(true);
    setMessage('');
    setError('');
  };

  // DELETE SCHEDULE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this schedule?'
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/schedules/${id}`);
      setMessage('Schedule deleted successfully!');
      setError('');
      fetchSchedules();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to delete schedule.'
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="records-section">

          <div className="section-heading">
            <div>
              <h2>Class Schedule</h2>
              <p>Manage and view your class schedules.</p>
            </div>

            <button
              className="add-student-btn"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus size={18} />
              Add Schedule
            </button>
          </div>

          {message && (
            <div className="password-success">
              {message}
            </div>
          )}

          {error && (
            <div className="password-error">
              {error}
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {showForm && (
            <div className="student-form-container">
              <div className="section-heading">
                <h3>
                  {editId ? 'Edit Schedule' : 'Add New Schedule'}
                </h3>

                <button
                  type="button"
                  onClick={resetForm}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>

                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  placeholder="Example: BSIT"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />

                <label>Day</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>

                <label>Start Time</label>
                <input
                  type="text"
                  name="startTime"
                  placeholder="Example: 08:00 AM"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />

                <label>End Time</label>
                <input
                  type="text"
                  name="endTime"
                  placeholder="Example: 10:00 AM"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />

                <label>Room</label>
                <input
                  type="text"
                  name="room"
                  placeholder="Example: Room 201"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className="add-student-btn"
                >
                  {editId ? 'Update Schedule' : 'Save Schedule'}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </form>
            </div>
          )}

          {/* SCHEDULE TABLE */}
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>DAY</th>
                  <th>SUBJECT</th>
                  <th>COURSE</th>
                  <th>TIME</th>
                  <th>ROOM</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading schedules...</td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No schedules available.
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td>{schedule.day}</td>
                      <td>{schedule.subject}</td>
                      <td>{schedule.course}</td>
                      <td>
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td>{schedule.room}</td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleEdit(schedule)}
                          title="Edit Schedule"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(schedule._id)}
                          title="Delete Schedule"
                        >
                          <Trash2 size={17} />
                        </button>
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

export default Schedule;
