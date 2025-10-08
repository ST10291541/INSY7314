const Payment = require("../models/Payment");

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    console.log("=== Payment Request Body ===");
    console.log(req.body);

    console.log("=== Authenticated User ===");
    console.log(req.user);

    const {
      amount,
      currency,
      provider,
      payeeAccountNumber,
      payeeBankName,
      swiftCode,
      payeeName,
      paymentReference,
      payeeRef
    } = req.body;

    const required = [amount, payeeAccountNumber, payeeBankName, swiftCode, payeeName, paymentReference];
    if (required.some((f) => !f)) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    if (!req.user) {
      console.log("No authenticated user found!");
      return res.status(401).json({ message: "Authentication required." });
    }

    const payment = new Payment({
      payerRef: req.user._id,
      payeeRef: payeeRef || "",
      paymentReference,
      amount,
      currency: currency || "ZAR",
      provider: provider || "SWIFT",
      payeeName,
      payeeBankName,
      payeeAccountNumber,
      swiftCode,
    });

    console.log("Saving Payment:", payment);
    await payment.save();

    res.status(201).json({ message: "Payment submitted successfully!", payment });
  } catch (error) {
    console.error("=== Payment Error ===");
    console.error(error);
    res.status(500).json({ message: "Error processing payment.", error: error.message });
  }
};


// Get all payments for a customer
exports.getCustomerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ payerRef: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, payerRef: req.user._id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching payment details", error });
  }
};

// Update payment status (e.g., verified, completed, rejected)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "verified", "submitted", "completed", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found." });

    payment.status = status;
    if (status === "verified") payment.verifiedAt = new Date();
    await payment.save();

    res.json({ message: `Payment status updated to ${status}.`, payment });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Error updating payment status.", error: error.message });
  }
};
