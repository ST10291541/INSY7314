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
import PaymentPage from "./pages/PaymentPage";
import MyPayments from './pages/MyPayments';
import PaymentDetails from './pages/PaymentDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          {/* Customer */}
          <Route 
            path="/customer-portal" 
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/make-payment" 
            element={
              <ProtectedRoute requiredRole="customer">
                <PaymentPage />
              </ProtectedRoute>
            } 
          />

          {/*Customer routes*/}
          <Route path="/my-payments" element={
            <ProtectedRoute requiredRole="customer">
              <MyPayments />
            </ProtectedRoute>
          } />

          <Route path="/payments/:id" element={
            <ProtectedRoute requiredRole="customer">
              <PaymentDetails />
            </ProtectedRoute>
          } />

          {/* Employee/Admin */}
          <Route 
            path="/employee-portal" 
            element={
              <ProtectedRoute requiredRole={['employee','admin']}>
                <EmployeePortal />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
