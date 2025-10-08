import './PaymentPage.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem('user') || '{}');
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const user = stored.user || {};
  const token = stored.token || "";

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ZAR',
    provider: 'SWIFT',
    payeeAccountNumber: '',
    payeeBankName: '',
    swiftCode: '',
    payeeName: '',
    paymentReference: '',  // NEW: Payer reference
    payeeRef: ''           // NEW: Optional payee reference
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token"); // token saved after login

  const paymentData = {
  amount: formData.amount,
  currency: formData.currency,
  provider: formData.provider,
  payeeAccountNumber: formData.payeeAccountNumber,
  payeeBankName: formData.payeeBankName,
  swiftCode: formData.swiftCode,
  payeeName: formData.payeeName,
  paymentReference: formData.paymentReference,
  payeeRef: formData.payeeRef,
};

  console.log("Submitting payment with data:", paymentData);

  try {
    const res = await axios.post(
      "https://localhost:5000/api/payments",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Payment success:", res.data);

    // ✅ Redirect to MyPayments page after successful payment
    navigate('/my-payments');
  } catch (err) {
    console.log("=== Frontend Payment Error ===");
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Payment failed. Please try again.");
  }
};

  return (
    <div className="payment-container">
      <h1>Make a Payment</h1>

      <form onSubmit={handlePayment}>
        <label>Amount:</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

        <label>Currency:</label>
        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="ZAR">ZAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <label>Provider:</label>
        <select name="provider" value={formData.provider} onChange={handleChange}>
          <option value="SWIFT">SWIFT</option>
        </select>

        <label>Payee Account Number:</label>
        <input type="text" name="payeeAccountNumber" value={formData.payeeAccountNumber} onChange={handleChange} required />

        <label>Payee Bank Name:</label>
        <input type="text" name="payeeBankName" value={formData.payeeBankName} onChange={handleChange} required />

        <label>SWIFT Code:</label>
        <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} required />

        <label>Payee Name:</label>
        <input type="text" name="payeeName" value={formData.payeeName} onChange={handleChange} required />

        <label>Payer Reference</label>
        <input
          type="text"
          name="paymentReference"
          value={formData.paymentReference}
          onChange={handleChange}
          placeholder="e.g. Order 123 Payment"
          required
        />

        <label>Payee Reference (optional)</label>
        <input
          type="text"
          name="payeeRef"
          value={formData.payeeRef}
          onChange={handleChange}
          placeholder="e.g. Invoice 456"
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
