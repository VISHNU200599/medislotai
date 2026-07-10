// src/app.js
// MediSlot — Official Express API Server with MongoDB Atlas Health Check
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/error.middleware");
const { getDBStatus } = require("./config/database");

const app = express();

// ─── Security & Rate Limiting ─────────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ─── CORS & Body Parsing ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ─── REQUIRED DATABASE HEALTH ENDPOINT ────────────────────────────────────────
app.get("/api/health/db", (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: dbStatus.isConnected ? "connected" : "disconnected",
    database: dbStatus.name || "medislot",
  });
});

app.get("/health", (req, res) => {
  const dbStatus = getDBStatus();
  res.status(dbStatus.isConnected ? 200 : 503).json({
    success: dbStatus.isConnected,
    message: dbStatus.isConnected 
      ? "🏥 MediSlot API & MongoDB Atlas are connected" 
      : "⚠️ MediSlot API is running, but MongoDB Atlas is disconnected",
    database: dbStatus,
  });
});

app.get("/api/v1/health/db", (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: dbStatus.isConnected ? "connected" : "disconnected",
    database: dbStatus.name || "medislot",
  });
});

// ─── API v1 Routes ────────────────────────────────────────────────────────────
app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/patients", require("./modules/patients/patients.routes"));
app.use("/api/v1/doctors", require("./modules/doctors/doctors.routes"));
app.use("/api/v1/hospitals", require("./modules/hospitals/hospitals.routes"));
app.use("/api/v1/departments", require("./modules/departments/departments.routes"));
app.use("/api/v1/appointments", require("./modules/appointments/appointments.routes"));

// ─── 404 & Global Error Handlers ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found on MediSlot API`,
  });
});

app.use(errorHandler);

module.exports = app;
