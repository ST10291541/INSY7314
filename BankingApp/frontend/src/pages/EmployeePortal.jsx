import React from 'react';

const EmployeePortal = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="portal-container">
      <h1>Employee Payment Portal</h1>
      <p>Welcome, {user.fullName} ({user.role})</p>
      
      <div className="portal-content">
        <h2>Payment Management</h2>
        <p>Payment verification functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default EmployeePortal;