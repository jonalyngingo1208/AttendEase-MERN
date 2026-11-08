
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarDays,
  Settings,
  GraduationCap,
  UserRound,
  LogOut
} from 'lucide-react';

import {
  NavLink,
  useNavigate,
  useLocation
} from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login', { replace: true });
  };

  // STUDENTS NAVIGATION
  const handleStudentsClick = () => {
    if (location.pathname !== '/') {
      navigate('/');

      setTimeout(() => {
        document.getElementById('students')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 300);
    } else {
      document.getElementById('students')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={26} />
        </div>

        <div>
          <h2>AttendEase</h2>
          <span>SMART ATTENDANCE</span>
        </div>
      </div>

      <p className="menu-label">MAIN MENU</p>

      {/* NAVIGATION MENU */}
      <nav className="menu">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <ClipboardCheck size={19} />
          Attendance
        </NavLink>

        <button
          type="button"
          className={`menu-item ${
            location.pathname === '/' ? '' : ''
          }`}
          onClick={handleStudentsClick}
        >
          <Users size={19} />
          Students
        </button>

        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <CalendarDays size={19} />
          Schedule
        </NavLink>

        {/* GRADES */}
        <NavLink
          to="/grades"
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <GraduationCap size={19} />
          Grades
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <CalendarDays size={19} />
          Attendance History
        </NavLink>

      </nav>

      {/* SIDEBAR BOTTOM */}
      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `menu-item ${isActive ? 'active' : ''}`
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <NavLink to="/profile" className="admin-card">
          <div className="admin-avatar">
            <UserRound size={20} />
          </div>

          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="menu-item logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;
