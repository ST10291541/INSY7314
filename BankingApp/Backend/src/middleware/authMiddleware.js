const jwt = require("jsonwebtoken");
const User = require("../models/User");

// HARDCODED EMPLOYEE - same as in authController
const HARDCODED_EMPLOYEE = {
  _id: "667eea1234567890abcdef",
  email: "employee@banking.com",
  role: "employee",
  accountNumber: null,
  fullName: "Manager",
  employeeId: "EMP001"
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CHECK IF THIS IS THE HARDCODED EMPLOYEE
    if (decoded.id === HARDCODED_EMPLOYEE._id) {
      console.log('✅ Using hardcoded employee');
      req.user = HARDCODED_EMPLOYEE;
      return next();
    }
    
    // REGULAR USER - lookup in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = { protect };