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

// 1️⃣ Parse JSON and CSP reports sent by the browser
app.use(express.json({ type: ['application/json', 'application/csp-report'] }));

// 2️⃣ Apply Helmet for baseline security headers
app.use(helmet());

// 3️⃣ Content Security Policy (CSP) - strict configuration
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],     // ✅ allow trusted CDN
  styleSrc:  ["'self'"],                                 // ✅ only local styles
  imgSrc:    ["'self'", "https://images.unsplash.com"],  // ✅ allow Unsplash images
  connectSrc:["'self'", "https://api.github.com"],       // ✅ allow specific API
  frameAncestors: ["'none'"],
};

// Apply CSP middleware
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      ...cspDirectives,
      "report-uri": ["/csp-report"], // receive violation reports
    },
    reportOnly: process.env.NODE_ENV !== "production", // dev: report-only, prod: enforced
  })
);

// 4️⃣ Route to receive CSP violation reports
app.post("/csp-report", (req, res) => {
  console.log("🛡️ CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// 5️⃣ CORS configuration for frontend
app.use(
  cors({
    origin: "https://localhost:5173", // React frontend URL
    credentials: true,
  })
);

// 6️⃣ Import your auth routes and middleware
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

// Auth routes
app.use("/api/auth", authRoutes);

// ✅ ADDITIONAL ROUTES

// Root API route
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

// Test protected route (verify RBAC)
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    user: req.user,
    role: req.user.role,
    timestamp: new Date()
  });
});

// Admin-only route
app.get("/api/admin-only", protect, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

  res.json({
    message: "Admin access granted! ✅",
    user: req.user
  });
});

// Export app for server.js
module.exports = app;