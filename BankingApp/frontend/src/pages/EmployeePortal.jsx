import React from 'react';
import { Link } from 'react-router-dom';
import './EmployeePortal.css';

const EmployeePortal = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="portal-container">
      <h1>Employee Payment Portal</h1>
      <p>Welcome, {user.fullName} ({user.role})</p>
      
      <div className="portal-content">
        <h2>Payment Management</h2>
        <div className="admin-actions">
          <Link to="/admin-payments" className="admin-link">
            View All Payments
          </Link>
          <Link to="/swift-codes" className="admin-link">
            SWIFT Codes Directory
          </Link>
        </div>
        <p>Access the admin payments dashboard to review and manage all customer payments.</p>
        
        {/* Debug: Test if this shows up */}
        <div style={{background: 'yellow', padding: '10px', margin: '10px 0'}}>
          DEBUG: If you can see this yellow box, the component is updating!
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;