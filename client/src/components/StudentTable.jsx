
import { Pencil, Trash2, Users } from 'lucide-react';

function StudentTable({ students = [], onEdit, onDelete, loading }) {
  return (
    <div className="table-wrapper">
      <table className="student-table">

        <thead>
          <tr>
            <th>STUDENT ID</th>
            <th>STUDENT NAME</th>
            <th>EMAIL</th>
            <th>COURSE</th>
            <th>YEAR LEVEL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="empty-state">
                Loading students...
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">
                <Users size={30} />
                <p>No student records found.</p>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>

                <td className="student-name">
                  {student.name}
                </td>

                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.yearLevel}</td>

                <td>
                  <div className="action-buttons">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => onEdit(student)}
                      title="Edit student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => onDelete(student._id)}
                      title="Delete student"
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default StudentTable;
