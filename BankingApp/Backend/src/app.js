// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// RATE LIMITING IMPORT
const { apiLimiter } = require('./middleware/rateLimiter');

// Create Express app
const app = express();

<<<<<<< HEAD
// 1️⃣ Parse JSON and CSP reports sent by the browser
app.use(express.json({ type: ['application/json', 'application/csp-report'] }));
=======
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
>>>>>>> upstream

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
const paymentRoutes = require("./routes/paymentRoutes");
const { protect } = require("./middleware/authMiddleware");

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

<<<<<<< HEAD
// ✅ ADDITIONAL ROUTES

=======
>>>>>>> upstream
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

<<<<<<< HEAD
// Test protected route (verify RBAC)
=======
// Test protected route
>>>>>>> upstream
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    user: req.user,
    role: req.user.role,
    timestamp: new Date()
  });
});

<<<<<<< HEAD
// Admin-only route
=======
// Test admin-only route
>>>>>>> upstream
app.get("/api/admin-only", protect, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

  res.json({
    message: "Admin access granted! ✅",
    user: req.user
  });
});

<<<<<<< HEAD
// Export app for server.js
module.exports = app;
=======
module.exports = app;
>>>>>>> upstream
