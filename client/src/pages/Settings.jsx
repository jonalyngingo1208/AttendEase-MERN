
import { useState } from 'react';

import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    try {
      setLoading(true);

      const response = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      setMessage(
        response.data.message || 'Password updated successfully!'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
              <h2>System Settings</h2>
              <p>Manage your AttendEase system preferences.</p>
            </div>
          </div>

          {/* SETTINGS CARDS */}
          <div className="stats-grid">

            <div className="stat-card">
              <SettingsIcon size={25} />
              <h3>General Settings</h3>
              <p>Manage system information.</p>
            </div>

            <div className="stat-card">
              <Bell size={25} />
              <h3>Notifications</h3>
              <p>Notification preferences.</p>
            </div>

            <div className="stat-card">
              <Shield size={25} />
              <h3>Security</h3>
              <p>Account security information.</p>
            </div>

            <div className="stat-card">
              <Database size={25} />
              <h3>Database</h3>
              <p>MongoDB database information.</p>
            </div>

          </div>

          {/* CHANGE PASSWORD */}
          <div className="stat-card change-password-card">

            <div className="password-heading">
              <Lock size={24} />

              <div>
                <h3>Change Password</h3>
                <p>Update your account password securely.</p>
              </div>
            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
              <div className="password-success">
                {message}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="password-error">
                {error}
              </div>
            )}

            <form
              className="password-form"
              onSubmit={handleChangePassword}
            >

              {/* CURRENT PASSWORD */}
              <label>Current Password</label>

              <div className="password-input">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label="Toggle current password visibility"
                >
                  {showCurrent
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>

              {/* NEW PASSWORD */}
              <label>New Password</label>

              <div className="password-input">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label="Toggle new password visibility"
                >
                  {showNew
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <label>Confirm New Password</label>

              <div className="password-input">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>

              <small className="password-hint">
                Your new password must contain at least 8 characters.
              </small>

              {/* UPDATE BUTTON */}
              <button
                type="submit"
                className="change-password-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

            </form>
          </div>

        </section>

        <footer className="footer">
          © 2026 AttendEase. Smart Attendance Management System.
        </footer>
      </main>
    </div>
  );
}

export default Settings;
