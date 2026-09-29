import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, token, loadFromStorage } = useAuthStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Loading persisted auth once is the app's initialization boundary.
  React.useEffect(() => {
    loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  // loadFromStorage is a stable Zustand store action.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!token && !!user;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
