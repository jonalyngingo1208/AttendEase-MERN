
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // GET LOGGED-IN USER
  const getUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  };

  const user = getUser();

  const userName = user?.name || 'Administrator';
  const userRole = user?.role || 'Admin';

  // DYNAMIC PAGE TITLE
  const pageTitles = {
    '/': 'Dashboard Overview',
    '/attendance': 'Attendance Management',
    '/history': 'Attendance History',
    '/schedule': 'Class Schedule',
    '/settings': 'System Settings',
    '/profile': 'My Profile'
  };

  const pageTitle = pageTitles[location.pathname] || 'AttendEase';

  return (
    <header className="topbar">

      <div className="page-heading">
        <h2>{pageTitle}</h2>
        <p>
          Welcome back, {userName}! Here's what's happening today.
        </p>
      </div>

      <div className="top-actions">

        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>

        <button
          className="notification-btn"
          aria-label="Notifications"
          type="button"
        >
          <Bell size={20} />
          <span></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
