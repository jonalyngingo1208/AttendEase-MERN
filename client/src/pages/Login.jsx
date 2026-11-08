
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // SAVE JWT TOKEN
      localStorage.setItem('token', token);

      // SAVE USER INFORMATION
      localStorage.setItem('user', JSON.stringify(user));

      // GO TO DASHBOARD
      navigate('/');

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>AttendEase</h1>
        <p>Smart Attendance Management System</p>

        <h2>Welcome Back!</h2>
        <p>Login to your account</p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
