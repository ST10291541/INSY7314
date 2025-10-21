import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPayments.css';

const AdminPayments = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, just show a message that the backend endpoint needs to be implemented
    setLoading(false);
    setError('Backend API endpoint /api/admin/payments not implemented yet. This is UI-only for now.');
  }, []);

  const handleApprove = (paymentId) => {
    alert('Approve functionality will be implemented when backend API is ready');
  };

  const handleReject = (paymentId) => {
    alert('Reject functionality will be implemented when backend API is ready');
  };

  if (loading) {
    return (
      <div className="admin-payments-container">
        <h1>Admin Payments</h1>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-payments-container">
        <h1>Admin Payments</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-payments-container">
      <h1>Admin Payments</h1>
      <p>Welcome, {user.fullName} ({user.role})</p>
      
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>SWIFT Code</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.payerRef?.fullName || 'N/A'}</td>
                  <td>{payment.swiftCode}</td>
                  <td>{payment.payeeBankName}</td>
                  <td>{payment.amount} {payment.currency}</td>
                  <td>
                    <span className={`status ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="actions">
                    {payment.status === 'pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(payment._id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleReject(payment._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {payment.status !== 'pending' && (
                      <span className="no-actions">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;