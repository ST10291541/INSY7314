// Import the Express framework to build the web server
const express = require('express');

// Import CORS middleware to allow cross-origin requests (e.g., React frontend calling Express backend)
const cors = require('cors');

// Import Helmet to set various secure HTTP headers automatically
const helmet = require('helmet');

// Import dotenv to load environment variables from a .env file into process.env
const dotenv = require('dotenv');

// Load environment variables (e.g., PORT, DB URI)
dotenv.config();

// Create an instance of an Express application
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Routes
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

// ✅ ADD THESE MISSING ROUTES:

// Root API route - fixes "Cannot GET /api"
app.get("/api", (req, res) => {
  res.json({
    message: "Banking API Server is running! 🚀",
    timestamp: new Date(),
    endpoints: {
      auth: "/api/auth",
      protected: "/api/protected",
      health: "/api/health"
    }
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is healthy ✅",
    status: "operational",
    timestamp: new Date()
  });
});

// Test protected route (to verify RBAC is working)
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    user: req.user,
    role: req.user.role,
    timestamp: new Date()
  });
});

// Test admin-only route
app.get("/api/admin-only", protect, (req, res, next) => {
  // Inline requireRole for testing
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  
  res.json({
    message: "Admin access granted!",
    user: req.user
  });
});


// Export the app so it can be used in server.js
module.exports = app;