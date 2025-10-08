const express = require("express");
const { registerCustomer, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roles"); 
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Registration rate limited
router.post("/register", registerLimiter, registerCustomer); 
// Login rate limited
router.post("/login", loginLimiter, login); 
module.exports = router;