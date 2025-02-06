// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get auth status from context

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render children if user is authenticated
};

export default PrivateRoute;
