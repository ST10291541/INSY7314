import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!requiredRoles.includes(user.role)) {
      // Redirect based on actual role
      if (user.role === 'employee' || user.role === 'admin') {
        return <Navigate to="/employee-portal" replace />;
      } else {
        return <Navigate to="/customer-portal" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;