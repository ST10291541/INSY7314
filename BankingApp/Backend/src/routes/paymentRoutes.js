const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roles");
const { 
  employeeActionLimiter,
  customerActionLimiter 
} = require("../middleware/rateLimiter"); // ✅ ADD RATE LIMITERS
const {
  createPayment,
  getCustomerPayments,
  getPaymentById,
  updatePaymentStatus
} = require("../controllers/paymentController");

// POST /api/payments → create a new payment (rate limited for customers)
router.post("/", protect, requireRole("customer"), customerActionLimiter, createPayment);

// GET /api/payments → list all payments for logged-in customer (rate limited)
router.get("/", protect, requireRole("customer"), customerActionLimiter, getCustomerPayments);

// GET /api/payments/:id → get details of a single payment (rate limited)
router.get("/:id", protect, requireRole("customer"), customerActionLimiter, getPaymentById);

// PATCH /api/payments/:id/status → update payment status (rate limited for employees)
router.patch("/:id/status", protect, requireRole(["employee","admin"]), employeeActionLimiter, updatePaymentStatus);

module.exports = router;