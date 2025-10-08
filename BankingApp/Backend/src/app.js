// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// RATE LIMITING IMPORT
const { apiLimiter } = require('./middleware/rateLimiter');

// Create Express app
const app = express();

// TRUST PROXY for rate limiting (important if behind reverse proxy)
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: "*", // Allow all origins inside container; restrict via LB if needed
  credentials: true
}));
app.use(express.json());

// Apply general API rate limiting
app.use('/api/', apiLimiter);

// Routes
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Root API route
app.get("/api", (req, res) => {
  res.json({
    message: "Banking API Server is running! 🚀",
    timestamp: new Date(),
    endpoints: {
      auth: "/api/auth",
      protected: "/api/protected",
      health: "/health"
    }
  });
});

// Health check route for Docker
app.get("/health", (req, res) => {
  res.json({
    status: "operational",
    timestamp: new Date()
  });
});

// Test protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    user: req.user,
    role: req.user.role,
    timestamp: new Date()
  });
});

// Test admin-only route
app.get("/api/admin-only", protect, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  
  res.json({
    message: "Admin access granted!",
    user: req.user
  });
});

module.exports = app;
