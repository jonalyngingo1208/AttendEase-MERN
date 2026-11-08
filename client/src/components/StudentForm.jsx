
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const initialForm = {
  studentId: '',
  name: '',
  email: '',
  course: '',
  yearLevel: ''
};

function StudentForm({ isOpen, onClose, onSubmit, editingStudent }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        studentId: editingStudent.studentId || '',
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        course: editingStudent.course || '',
        yearLevel: editingStudent.yearLevel || ''
      });
    } else {
      setFormData(initialForm);
    }

    setSubmitting(false);
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;

    setFormData(initialForm);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="student-modal">

        <div className="modal-header">
          <div>
            <h2>
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p>Enter the student's information below.</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="close-btn"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Student ID</label>
          <input
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="STU-001"
            required
          />

          <label>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@email.com"
            required
          />

          <label>Course</label>
          <input
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="BSIT"
            required
          />

          <label>Year Level</label>
          <select
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Year Level</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingStudent
                  ? 'Update Student'
                  : 'Save Student'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
