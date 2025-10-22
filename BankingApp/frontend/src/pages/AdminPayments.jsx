
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPayments.css';

const AdminPayments = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null); // Tracks which payment is being processed

  useEffect(() => {
    fetchPayments();
  }, [user.token]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('Fetching payments with token:', user.token ? 'Token exists' : 'No token');
      
      const response = await axios.get('https://localhost:5000/api/admin/payments', {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Payments fetched successfully:', response.data);
      setPayments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to fetch payments. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    try {
      setProcessing(paymentId);
      
      const response = await axios.post(
        `https://localhost:5000/api/admin/payments/${paymentId}/approve`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the payment in the local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment._id === paymentId 
            ? response.data.payment
            : payment
        )
      );
      
      alert(response.data.message);
    } catch (err) {
      console.error('Error approving payment:', err);
      const errorMessage = err.response?.data?.message || 
                          'Failed to approve payment. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (paymentId) => {
    const rejectionReason = prompt('Please enter a reason for rejection (optional):');
    
    // If user clicks cancel, do nothing
    if (rejectionReason === null) return;

    if (!window.confirm('Are you sure you want to reject this payment?')) {
      return;
    }

    try {
      setProcessing(paymentId);
      
      const response = await axios.post(
        `https://localhost:5000/api/admin/payments/${paymentId}/reject`,
        { rejectionReason },
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the payment in the local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment._id === paymentId 
            ? response.data.payment
            : payment
        )
      );
      
      alert(response.data.message);
    } catch (err) {
      console.error('Error rejecting payment:', err);
      const errorMessage = err.response?.data?.message || 
                          'Failed to reject payment. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcessing(null);
    }
  };

  // Count payments by status
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifiedCount = payments.filter(p => p.status === 'verified').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  if (loading) {
    return (
      <div className="admin-payments-container">
        <h1>Admin Payments Dashboard</h1>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-payments-container">
        <h1>Admin Payments Dashboard</h1>
        <p className="error">Error: {error}</p>
        <button onClick={fetchPayments} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-payments-container">
      <h1>Admin Payments Dashboard</h1>
      <p>Welcome, {user.fullName} ({user.role})</p>
      
      {/* Status Summary */}
      <div className="status-summary">
        <div className="summary-item pending">
          <span className="count">{pendingCount}</span>
          <span className="label">Pending</span>
        </div>
        <div className="summary-item verified">
          <span className="count">{verifiedCount}</span>
          <span className="label">Approved</span>
        </div>
        <div className="summary-item rejected">
          <span className="count">{rejectedCount}</span>
          <span className="label">Rejected</span>
        </div>
        <div className="summary-item total">
          <span className="count">{payments.length}</span>
          <span className="label">Total</span>
        </div>
      </div>
      
      {payments.length === 0 ? (
        <p>No payments found in the system.</p>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Payee Details</th>
                <th>Bank & SWIFT</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    <div className="customer-info">
                      <strong>{payment.customerName}</strong>
                      <br />
                      <small>{payment.customerEmail}</small>
                      <br />
                      <small>Acc: {payment.customerAccount}</small>
                    </div>
                  </td>
                  <td>
                    <div className="payee-info">
                      <strong>{payment.payeeName}</strong>
                      <br />
                      <small>Acc: {payment.payeeAccountNumber}</small>
                    </div>
                  </td>
                  <td>
                    <div className="bank-info">
                      <strong>{payment.payeeBankName}</strong>
                      <br />
                      <span className="swift-code">{payment.swiftCode}</span>
                    </div>
                  </td>
                  <td className="amount-cell">
                    {payment.amount} {payment.currency}
                  </td>
                  <td>
                    <div className="reference-info">
                      <small><strong>Payer:</strong> {payment.paymentReference}</small>
                      {payment.payeeRef && (
                        <>
                          <br />
                          <small><strong>Payee:</strong> {payment.payeeRef}</small>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    {new Date(payment.createdAt).toLocaleDateString()}
                    <br />
                    <small>{new Date(payment.createdAt).toLocaleTimeString()}</small>
                  </td>
                  <td className="actions">
                    {payment.status === 'pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(payment._id)}
                          disabled={processing === payment._id}
                          title="Approve this payment"
                        >
                          {processing === payment._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleReject(payment._id)}
                          disabled={processing === payment._id}
                          title="Reject this payment"
                        >
                          {processing === payment._id ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    {payment.status !== 'pending' && (
                      <span className="no-actions">
                        {payment.status === 'verified' ? 'Approved' : 
                         payment.status === 'rejected' ? 'Rejected' : 'No actions'}
                      </span>
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
