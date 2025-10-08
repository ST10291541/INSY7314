const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      accountNumber: user.accountNumber
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

// ✅ HARDCODED EMPLOYEE CREDENTIALS (No admin needed)
const HARDCODED_EMPLOYEE = {
  email: "employee@bank.com",
  password: "employee123!",
  id: "hardcoded-employee-id-12345",
  fullName: "Bank Employee",
  role: "employee",
  employeeId: "EMP001",
  department: "Payments"
};

// Customer registration
exports.registerCustomer = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, username, password, email } = req.body;
    
    const existing = await User.findOne({ 
      $or: [{ email }, { idNumber }, { accountNumber }, { username }] 
    });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const customer = await User.create({
      fullName,
      idNumber,
      accountNumber,
      username,
      email,
      password,
      role: "customer"
    });

    const token = generateToken(customer);
    res.status(201).json({ 
      message: "Customer registered successfully", 
      token,
      user: { id: customer._id, username: customer.username, role: customer.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Login for both customers and employees
exports.login = async (req, res) => {
  try {
    const { email, password, username, login } = req.body;
    
    const userIdentifier = email || login;
    
    // ✅ HARDCODED EMPLOYEE CHECK
    if (userIdentifier === HARDCODED_EMPLOYEE.email && password === HARDCODED_EMPLOYEE.password) {
      const token = generateToken(HARDCODED_EMPLOYEE);
      return res.json({ 
        token,
        user: { 
          id: HARDCODED_EMPLOYEE.id,
          email: HARDCODED_EMPLOYEE.email,
          role: HARDCODED_EMPLOYEE.role,
          fullName: HARDCODED_EMPLOYEE.fullName,
          employeeId: HARDCODED_EMPLOYEE.employeeId
        }
      });
    }
    
    // Regular customer login
    const user = await User.findOne({
      $or: [{ email: userIdentifier }, { username: userIdentifier }]
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ 
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        accountNumber: user.accountNumber 
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

