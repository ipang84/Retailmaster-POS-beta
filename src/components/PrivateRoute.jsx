import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, requiredPermission }) {
  const { isAuthenticated, hasPermission, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If a specific permission is required, check for it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If authenticated and authorized, render the protected component
  return children;
}

export default PrivateRoute;
