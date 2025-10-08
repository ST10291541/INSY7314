const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roles");
const {
  createPayment,
  getCustomerPayments,
  getPaymentById,
  updatePaymentStatus
} = require("../controllers/paymentController");

// POST /api/payments → create a new payment
router.post("/", protect, requireRole("customer"), createPayment);

// GET /api/payments → list all payments for logged-in customer
router.get("/", protect, requireRole("customer"), getCustomerPayments);

// GET /api/payments/:id → get details of a single payment
router.get("/:id", protect, requireRole("customer"), getPaymentById);

router.patch("/:id/status", protect, requireRole(["employee","admin"]), updatePaymentStatus);

module.exports = router;
