import './MyPayments.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPayments = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('https://localhost:5000/api/payments', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPayments(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || 'Error fetching payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user.token]);

  return (
    <div className="my-payments-container">
      <h1>My Payments</h1>
      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <ul>
          {payments.map(p => (
            <li key={p._id} onClick={() => navigate(`/payments/${p._id}`)} className="payment-item">
              <div className="payment-summary">

                {/* Payment Reference Info */}
                <div className="reference-info">
                  <h4>Payment References</h4>
                  <p><strong>Payer Reference:</strong> {p.paymentReference}</p>
                  {p.payeeRef && <p><strong>Payee Reference:</strong> {p.payeeRef}</p>}
                </div>

                {/* Payee / Payment Info */}
                <div className="payee-info">
                  <h4>Payee / Payment</h4>
                  <p><strong>Payee:</strong> {p.payeeName}</p>
                  <p><strong>Amount:</strong> {p.amount} {p.currency}</p>
                  <p><strong>Status:</strong> <span className={`status ${p.status}`}>{p.status}</span></p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPayments;
