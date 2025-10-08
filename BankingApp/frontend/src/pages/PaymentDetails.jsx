import './PaymentDetails.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://localhost:5000/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPayment(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || 'Error fetching payment details');
        navigate('/my-payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id, user.token, navigate]);

  const updateStatus = async (status) => {
    if (!window.confirm(`Are you sure you want to mark this payment as "${status}"?`)) return;

    try {
      setUpdatingStatus(true);
      const res = await axios.patch(`https://localhost:5000/api/payments/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPayment(res.data.payment);
      alert(res.data.message);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <p>Loading payment details...</p>;
  if (!payment) return <p>Payment not found.</p>;

  return (
    <div className="payment-details-container">
      <h1>Payment Details</h1>

      {/* Payment & Payee Info */}
      <div className="section">
        <h3>Payment Info</h3>
        <p><strong>Payee Name:</strong> {payment.payeeName}</p>
        <p><strong>Payee Account Number:</strong> {payment.payeeAccountNumber}</p>
        <p><strong>Payee Bank:</strong> {payment.payeeBankName}</p>
        <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
        <p><strong>Amount:</strong> {payment.amount} {payment.currency}</p>
        <p><strong>Provider:</strong> {payment.provider}</p>
        <p><strong>Status:</strong> <span className={`status ${payment.status}`}>{payment.status}</span></p>
        <p><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>

      {/* Employee/Admin: Update Status */}
      {["employee", "admin"].includes(user.role) && (
        <div className="section">
          <h3>Update Status</h3>
          <button disabled={updatingStatus} onClick={() => updateStatus("verified")}>Mark as Verified</button>
          <button disabled={updatingStatus} onClick={() => updateStatus("completed")}>Mark as Completed</button>
          <button disabled={updatingStatus} onClick={() => updateStatus("rejected")}>Reject Payment</button>
        </div>
      )}

      <button onClick={() => navigate('/my-payments')}>Back to My Payments</button>
    </div>
  );
};

export default PaymentDetails;
