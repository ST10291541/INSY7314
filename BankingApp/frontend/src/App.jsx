import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerPortal from "./pages/CustomerPortal";
import EmployeePortal from "./pages/EmployeePortal";
import Logout from "./pages/Logout";
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected customer routes */}
          <Route 
            path="/customer-portal" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerPortal />
              </ProtectedRoute>
            } 
          />

          {/* Protected employee routes */}
          <Route 
            path="/employee-portal" 
            element={
              <ProtectedRoute requiredRole={['employee', 'admin']}>
                <EmployeePortal />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;