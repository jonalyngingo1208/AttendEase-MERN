
import { useState } from 'react';

import {
  UserRound,
  Mail,
  Shield,
  GraduationCap,
  RefreshCw,
  LogOut
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Profile() {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getUser);

  const userName = user?.name || 'Administrator';
  const userEmail = user?.email || 'No email available';
  const userRole = user?.role || 'Admin';

  // REFRESH PROFILE
  const refreshProfile = () => {
    setUser(getUser());
  };

  // LOGOUT
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmLogout) return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="records-section">

          {/* PAGE HEADING */}
          <div className="section-heading">
            <div>
              <h2>My Profile</h2>
              <p>View your AttendEase account information.</p>
            </div>

            <button
              className="refresh-btn"
              onClick={refreshProfile}
            >
              <RefreshCw size={17} />
              Refresh Profile
            </button>
          </div>

          {/* PROFILE CARD */}
          <div className="stat-card profile-details">

            <div className="admin-avatar profile-large">
              <UserRound size={30} />
            </div>

            <h2>{userName}</h2>

            <p>{userRole}</p>

            {/* ACCOUNT INFORMATION */}
            <div className="profile-info">

              <p>
                <UserRound size={18} />
                Name: {userName}
              </p>

              <p>
                <Mail size={18} />
                Email: {userEmail}
              </p>

              <p>
                <Shield size={18} />
                Role: {userRole}
              </p>

              <p>
                <GraduationCap size={18} />
                System: AttendEase
              </p>

            </div>

            {/* LOGOUT BUTTON */}
            <button
              className="change-password-btn"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </section>

        <footer className="footer">
          © 2026 AttendEase. Smart Attendance Management System.
        </footer>

      </main>
    </div>
  );
}

export default Profile;
