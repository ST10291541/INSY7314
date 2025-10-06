const express = require("express");
const { registerCustomer, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roles"); 

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", login);
module.exports = router;