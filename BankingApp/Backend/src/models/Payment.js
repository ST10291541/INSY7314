const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payeeRef: { type: String, required: true }, // still holds the payee account number or ID

  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "ZAR" },
  provider: { type: String, required: true, default: "SWIFT" },

  // NEW FIELD — text entered by the payer
  paymentReference: { type: String, required: true }, // e.g. "Order 123 payment"

  // Payee info
  payeeName: { type: String, required: true },
  payeeBankName: { type: String, required: true },
  payeeAccountNumber: { type: String, required: true },
  swiftCode: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "verified", "submitted", "completed", "rejected"],
    default: "pending"
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
