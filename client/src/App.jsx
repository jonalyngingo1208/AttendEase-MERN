
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import AttendanceHistory from './pages/AttendanceHistory';
import Schedule from './pages/Schedule';
import Grades from './pages/Grades';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED PAGES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/history" element={<AttendanceHistory />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* INVALID URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
