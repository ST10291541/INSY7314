import React from 'react';

const CustomerPortal = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="portal-container">
      <h1>Customer Payment Portal</h1>
      <p>Welcome, {user.fullName}!</p>
      <p>Account Number: {user.accountNumber}</p>
      
      <div className="portal-content">
        <h2>Your Dashboard</h2>
        <p>Payment functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default CustomerPortal;