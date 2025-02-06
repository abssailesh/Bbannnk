import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component
import ForgotPassword from './components/ForgotPassword'; // Import ForgotPassword component
import ResetPassword from './components/ResetPassword'; // Import ResetPassword component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add ForgotPassword route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Add ResetPassword route */}
          {/* Protect profile route using PrivateRoute */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
