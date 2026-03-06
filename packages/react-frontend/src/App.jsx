import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SSOPage from './SSOPage';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from './ProfilePage';
import MyRidesPage from './MyRidesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SSOPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-rides"
        element={
          <ProtectedRoute>
            <MyRidesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
