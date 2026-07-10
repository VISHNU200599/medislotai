// src/config/database.js
const mongoose = require("mongoose");

let isConnected = false;

/**
 * Connect to MongoDB Atlas using Mongoose with retry logic and error handling
 */
const connectDB = async (retries = 5, delay = 3000) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB is already connected.");
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "medislot";

  if (!uri) {
    console.error("❌ MongoDB Connection Failed: MONGODB_URI is missing in .env");
    return null;
  }

  const options = {
    dbName: dbName,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    family: 4, // IPv4
  };

  while (retries > 0) {
    try {
      console.log(`⏳ Attempting to connect to MongoDB Atlas [Database: ${dbName}]...`);
      const conn = await mongoose.connect(uri, options);
      
      isConnected = true;
      console.log("✅ MongoDB Connected");
      console.log(`✅ MongoDB Atlas Connected Successfully! [Host: ${conn.connection.host}, DB: ${conn.connection.name}]`);
      
      // Setup connection event listeners
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection runtime error:", err);
        isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected. Attempting automatic reconnection...");
        isConnected = false;
      });

      // Graceful shutdown handling
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("🛑 MongoDB connection gracefully closed due to application termination.");
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await mongoose.connection.close();
        console.log("🛑 MongoDB connection gracefully closed due to SIGTERM.");
        process.exit(0);
      });

      return conn;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB Connection Failed: ${error.message}`);
      
      if (retries === 0) {
        console.error("💥 All MongoDB connection retry attempts exhausted.");
        return null;
      }
      
      console.log(`🔄 Retrying MongoDB connection in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

/**
 * Helper to check current MongoDB connection status
 */
const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return {
    status: states[state] || "disconnected",
    isConnected: state === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || "medislot",
  };
};

module.exports = { connectDB, getDBStatus };
