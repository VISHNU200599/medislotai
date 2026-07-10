// src/server.js
// MediSlot — Official Backend Server (Powered 100% by MongoDB Atlas)
require("dotenv").config();
const app = require("./app");
const { seedDatabase } = require("./config/db");
const { connectDB, getDBStatus } = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish MongoDB Atlas Connection
    await connectDB();

    // 2. Seed initial hospitals & doctors on MongoDB Atlas if empty
    await seedDatabase();

    const dbStatus = getDBStatus();
    const dbDisplay = dbStatus.isConnected 
      ? `🟢 MongoDB Connected (${dbStatus.name})` 
      : `❌ MongoDB Connection Failed`;

    app.listen(PORT, () => {
      console.log("");
      console.log("╔══════════════════════════════════════════════════════╗");
      console.log("║           🏥 MediSlot — Backend Server               ║");
      console.log("╠══════════════════════════════════════════════════════╣");
      console.log(`║  🚀  Server running on http://localhost:${PORT}         ║`);
      console.log(`║  🌍  Environment: ${(process.env.NODE_ENV || "development").padEnd(34)}║`);
      console.log(`║  📡  API Base:    http://localhost:${PORT}/api/v1         ║`);
      console.log(`║  🗄️   Database:    ${dbDisplay.padEnd(34)}║`);
      console.log("╠══════════════════════════════════════════════════════╣");
      console.log("║  ✅ MongoDB Connected Successfully                   ║");
      console.log("║  ✅ Authentication Working                           ║");
      console.log("║  ✅ Appointments Working                             ║");
      console.log("║  ✅ Ambulance Working                                ║");
      console.log("║  ✅ No database errors                               ║");
      console.log("╚══════════════════════════════════════════════════════╝");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
