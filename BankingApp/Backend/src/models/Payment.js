const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // Customer information
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerAccountNumber: { type: String, required: true },
  
  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" },
  provider: { type: String, required: true, default: "SWIFT" },
  
  // Recipient details
  payeeAccountNumber: { type: String, required: true },
  payeeBankName: { type: String, required: true },
  swiftCode: { type: String, required: true },
  payeeName: { type: String, required: true },
  
  // Payment status
  status: { 
    type: String, 
    enum: ["pending", "verified", "submitted", "completed", "rejected"], 
    default: "pending" 
  },
  
  // Verification details
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verifiedAt: { type: Date },
  submittedToSWIFTAt: { type: Date }
  
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);