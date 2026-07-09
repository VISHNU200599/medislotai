// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ─── Health Check & MongoDB Verification ──────────────────────────────────────
const { getDBStatus } = require("./config/database");
const mongoose = require("mongoose");

app.get("/health", (req, res) => {
  const dbStatus = getDBStatus();
  res.status(dbStatus.isConnected ? 200 : 503).json({
    success: dbStatus.isConnected,
    message: dbStatus.isConnected 
      ? "🏥 MediSlot AI API & MongoDB Atlas are healthy" 
      : "⚠️ MediSlot AI API is running, but MongoDB Atlas is disconnected",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
  });
});

// Live CRUD Verification Endpoint
app.get("/api/v1/health/db", async (req, res) => {
  const dbStatus = getDBStatus();
  if (!dbStatus.isConnected) {
    return res.status(503).json({
      success: false,
      message: "Cannot verify CRUD: MongoDB Atlas is disconnected.",
      database: dbStatus,
      hint: "Please check MONGODB_URI in backend/.env",
    });
  }

  try {
    const VerifySchema = new mongoose.Schema({
      testId: String,
      message: String,
      status: String,
      createdAt: { type: Date, default: Date.now },
    });
    const VerifyModel = mongoose.models.AtlasVerifyAPI || mongoose.model("AtlasVerifyAPI", VerifySchema);

    // 1. CREATE
    const testDoc = await VerifyModel.create({
      testId: `API-VERIFY-${Date.now()}`,
      message: "MongoDB Atlas API CRUD Test",
      status: "CREATED",
    });

    // 2. READ
    const readDoc = await VerifyModel.findById(testDoc._id);

    // 3. UPDATE
    readDoc.status = "UPDATED";
    await readDoc.save();

    // 4. DELETE
    await VerifyModel.findByIdAndDelete(testDoc._id);

    res.status(200).json({
      success: true,
      message: "🎉 All 4 CRUD operations (Create, Read, Update, Delete) succeeded on MongoDB Atlas!",
      database: dbStatus,
      crud_test_results: {
        create: { success: true, id: testDoc._id },
        read: { success: true, message: readDoc.message },
        update: { success: true, new_status: readDoc.status },
        delete: { success: true, deleted_id: testDoc._id },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "CRUD Verification Failed on MongoDB Atlas",
      error: error.message,
    });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/patients", require("./modules/patients/patients.routes"));
app.use("/api/v1/doctors", require("./modules/doctors/doctors.routes"));
app.use("/api/v1/hospitals", require("./modules/hospitals/hospitals.routes"));
app.use("/api/v1/departments", require("./modules/departments/departments.routes"));
app.use("/api/v1/appointments", require("./modules/appointments/appointments.routes"));

// ─── AI Module Stubs (Future) ─────────────────────────────────────────────────
app.use("/api/v1/ai", (req, res) => {
  res.status(503).json({
    success: false,
    message: "AI Module is coming in Version 2. Stay tuned! 🤖",
    planned_features: [
      "Symptom Checker",
      "Smart Doctor Recommendation",
      "Waiting Time Prediction",
      "Health Score",
      "AI Chatbot",
    ],
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
