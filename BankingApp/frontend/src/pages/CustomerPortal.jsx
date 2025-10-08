import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerPortal = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="portal-container">
      <h1>Customer Payment Portal</h1>
      <p>Welcome, {user.fullName}!</p>
      <p>Account Number: {user.accountNumber}</p>

      <div className="portal-content">
        <h2>Your Dashboard</h2>
        <p>Manage and track your international payments here.</p>

        {/* Buttons */}
        <button 
          className="make-payment-btn"
          onClick={() => navigate('/make-payment')}
        >
          Make Payment
        </button>

        <button 
          className="view-payments-btn"
          onClick={() => navigate('/my-payments')}
          style={{ marginLeft: '10px' }}
        >
          View My Payments
        </button>
      </div>
    </div>
  );
};

export default CustomerPortal;
