const express = require('express');
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roles");

// GET /api/admin/payments - Get all payments (admin/employee only)
router.get('/admin/payments', protect, requireRole(['employee', 'admin']), async (req, res) => {
  try {
    console.log('Fetching all payments for admin...');
    
    // Get all payments with user information
    const payments = await Payment.find()
      .populate('payerRef', 'fullName email username accountNumber') // Populate user details
      .sort({ createdAt: -1 }); // Sort by latest first

    console.log(`Found ${payments.length} payments`);

    // Format the response
    const formattedPayments = payments.map(payment => ({
      _id: payment._id,
      customerName: payment.payerRef?.fullName || 'Unknown Customer',
      customerEmail: payment.payerRef?.email || 'No email',
      customerAccount: payment.payerRef?.accountNumber || 'N/A',
      amount: payment.amount,
      currency: payment.currency,
      payeeName: payment.payeeName,
      payeeBankName: payment.payeeBankName,
      swiftCode: payment.swiftCode,
      payeeAccountNumber: payment.payeeAccountNumber,
      paymentReference: payment.paymentReference,
      payeeRef: payment.payeeRef,
      status: payment.status,
      provider: payment.provider,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Admin payments error:', error);
    res.status(500).json({ 
      message: 'Server error fetching payments',
      error: error.message 
    });
  }
});

// POST /api/admin/payments/:id/approve - Approve a payment
router.post('/admin/payments/:id/approve', protect, requireRole(['employee', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Approving payment ${id} by user ${req.user._id}`);

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment is already processed
    if (payment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Payment is already ${payment.status}. Cannot approve.` 
      });
    }

    // Validate SWIFT code format (basic validation)
    if (!isValidSwiftCode(payment.swiftCode)) {
      return res.status(400).json({ 
        message: 'Invalid SWIFT code format. Cannot approve payment.' 
      });
    }

    // Update payment status
    payment.status = 'verified';
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();

    await payment.save();

    // Populate the updated payment for response
    const updatedPayment = await Payment.findById(id)
      .populate('payerRef', 'fullName email username accountNumber');

    res.json({
      message: 'Payment approved successfully!',
      payment: {
        _id: updatedPayment._id,
        customerName: updatedPayment.payerRef?.fullName || 'Unknown Customer',
        customerEmail: updatedPayment.payerRef?.email || 'No email',
        customerAccount: updatedPayment.payerRef?.accountNumber || 'N/A',
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        payeeName: updatedPayment.payeeName,
        payeeBankName: updatedPayment.payeeBankName,
        swiftCode: updatedPayment.swiftCode,
        payeeAccountNumber: updatedPayment.payeeAccountNumber,
        paymentReference: updatedPayment.paymentReference,
        payeeRef: updatedPayment.payeeRef,
        status: updatedPayment.status,
        provider: updatedPayment.provider,
        createdAt: updatedPayment.createdAt,
        updatedAt: updatedPayment.updatedAt
      }
    });

  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ 
      message: 'Error approving payment',
      error: error.message 
    });
  }
});

// POST /api/admin/payments/:id/reject - Reject a payment
router.post('/admin/payments/:id/reject', protect, requireRole(['employee', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log(`Rejecting payment ${id} by user ${req.user._id}`);

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment is already processed
    if (payment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Payment is already ${payment.status}. Cannot reject.` 
      });
    }

    // Update payment status
    payment.status = 'rejected';
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();

    await payment.save();

    // Populate the updated payment for response
    const updatedPayment = await Payment.findById(id)
      .populate('payerRef', 'fullName email username accountNumber');

    res.json({
      message: 'Payment rejected successfully!' + (rejectionReason ? ` Reason: ${rejectionReason}` : ''),
      payment: {
        _id: updatedPayment._id,
        customerName: updatedPayment.payerRef?.fullName || 'Unknown Customer',
        customerEmail: updatedPayment.payerRef?.email || 'No email',
        customerAccount: updatedPayment.payerRef?.accountNumber || 'N/A',
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        payeeName: updatedPayment.payeeName,
        payeeBankName: updatedPayment.payeeBankName,
        swiftCode: updatedPayment.swiftCode,
        payeeAccountNumber: updatedPayment.payeeAccountNumber,
        paymentReference: updatedPayment.paymentReference,
        payeeRef: updatedPayment.payeeRef,
        status: updatedPayment.status,
        provider: updatedPayment.provider,
        createdAt: updatedPayment.createdAt,
        updatedAt: updatedPayment.updatedAt
      }
    });

  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ 
      message: 'Error rejecting payment',
      error: error.message 
    });
  }
});

// Helper function to validate SWIFT code format
function isValidSwiftCode(swiftCode) {
  // Basic SWIFT code validation: 8 or 11 characters, alphanumeric
  if (!swiftCode || typeof swiftCode !== 'string') return false;
  
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(swiftCode.toUpperCase());
}

module.exports = router;
