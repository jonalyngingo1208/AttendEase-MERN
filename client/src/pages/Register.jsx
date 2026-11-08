
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import API from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <div style={{ textAlign: 'center', color: '#e94f98' }}>
          <GraduationCap size={40} />
        </div>

        <h1>AttendEase</h1>
        <p>Smart Attendance Management System</p>

        <h2>Create Account</h2>
        <p className="register-subtitle">
          Register your teacher account
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        {message && (
          <div className="password-success">{message}</div>
        )}

        <form onSubmit={handleRegister}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        <p className="register-link">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
