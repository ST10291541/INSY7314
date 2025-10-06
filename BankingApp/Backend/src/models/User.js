const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Customer registration fields
  fullName: { type: String },
  idNumber: { type: String, unique: true, sparse: true },
  accountNumber: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  
  // Common fields
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["customer", "employee", "admin"], 
    required: true 
  },
  
  // Employee-specific (pre-registered by admin)
  employeeId: { type: String, unique: true, sparse: true },
  department: { type: String }
}, { timestamps: true });

// Password comparison
userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);