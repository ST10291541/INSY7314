import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerPortal.css'; // Import the portal styles

const CustomerPortal = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="portal-container">
      <div className="portal-content">
        <h1>Customer Payment Portal</h1>
        <p className="welcome-text">Welcome, {user.fullName || user.username}!</p>

        <h2>Your Dashboard</h2>
        <p>Manage and track your international payments here.</p>

        <div className="portal-buttons">
          <button 
            className="make-payment-btn"
            onClick={() => navigate('/make-payment')}
          >
            Make Payment
          </button>

          <button 
            className="view-payments-btn"
            onClick={() => navigate('/my-payments')}
          >
            View My Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
