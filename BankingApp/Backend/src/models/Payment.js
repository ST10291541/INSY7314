const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payeeRef: { type: String, required: true },

  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "ZAR" },
  provider: { type: String, required: true, default: "SWIFT" },

 
  paymentReference: { type: String, required: true },

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
  
  // Allow both ObjectId and String for hardcoded employees
  verifiedBy: { 
    type: mongoose.Schema.Types.Mixed, // Allows both ObjectId and String
    ref: "User" 
  },
  
  verifiedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);