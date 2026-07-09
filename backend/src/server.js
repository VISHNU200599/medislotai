// src/server.js
require("dotenv").config();
const app = require("./app");
const { seedDatabase } = require("./config/db");
const { connectDB, getDBStatus } = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish MongoDB Atlas Connection
    await connectDB();

    // 2. Seed demo data (in-memory fallback / hybrid mode)
    await seedDatabase();

    const dbStatus = getDBStatus();
    const dbDisplay = dbStatus.isConnected 
      ? `🟢 Connected (${dbStatus.name} @ Atlas)` 
      : `🟡 In-Memory Fallback (Check MONGODB_URI)`;

    app.listen(PORT, () => {
      console.log("");
      console.log("╔══════════════════════════════════════════════════════╗");
      console.log("║           🏥 MediSlot AI — Backend Server            ║");
      console.log("╠══════════════════════════════════════════════════════╣");
      console.log(`║  🚀  Server running on http://localhost:${PORT}         ║`);
      console.log(`║  🌍  Environment: ${(process.env.NODE_ENV || "development").padEnd(34)}║`);
      console.log(`║  📡  API Base:    http://localhost:${PORT}/api/v1         ║`);
      console.log(`║  🗄️   Database:    ${dbDisplay.padEnd(34)}║`);
      console.log("╠══════════════════════════════════════════════════════╣");
      console.log("║  Demo Credentials:                                   ║");
      console.log("║  Patient:  register at /api/v1/auth/register         ║");
      console.log("║  Doctor:   dr.sharma@medislot.com / password123      ║");
      console.log("║  Admin:    admin@apollo.com / password123            ║");
      console.log("╚══════════════════════════════════════════════════════╝");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
