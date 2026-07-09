// src/config/database.js
const mongoose = require("mongoose");

// Track connection state
let isConnected = false;

/**
 * Connect to MongoDB Atlas using Mongoose with retry logic and error handling
 * @param {number} retries - Number of connection attempts before failing
 * @param {number} delay - Delay in ms between retries
 */
const connectDB = async (retries = 3, delay = 5000) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB is already connected.");
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "medislotai";

  if (!uri || uri.includes("<your-cluster-domain>") || uri.includes("<your-cluster-url>")) {
    console.log("");
    console.warn("⚠️  [MongoDB Warning]: MONGODB_URI is not configured or contains placeholders in .env");
    console.warn("⚠️  Please update MONGODB_URI in backend/.env with your MongoDB Atlas cluster domain.");
    console.warn("⚠️  Running backend with in-memory fallback store until Atlas URI is set.");
    console.log("");
    return null;
  }

  const options = {
    dbName: dbName,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    family: 4, // Use IPv4, skip trying IPv6
  };

  while (retries > 0) {
    try {
      console.log(`⏳ Attempting to connect to MongoDB Atlas [Database: ${dbName}]...`);
      const conn = await mongoose.connect(uri, options);
      
      isConnected = true;
      console.log(`✅ MongoDB Atlas Connected Successfully!`);
      console.log(`🌐 Host: ${conn.connection.host}`);
      console.log(`📦 Database Name: ${conn.connection.name}`);
      
      // Setup event listeners for connection drops
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection runtime error:", err);
        isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected. Attempting automatic reconnection...");
        isConnected = false;
      });

      // Graceful shutdown on application termination
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("🛑 MongoDB Atlas connection gracefully closed due to app termination.");
        process.exit(0);
      });

      return conn;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB Atlas connection failed: ${error.message}`);
      
      if (retries === 0) {
        console.error("💥 All MongoDB connection retry attempts exhausted.");
        if (process.env.NODE_ENV === "production") {
          console.error("🛑 Exiting process in production mode due to database unavailability.");
          process.exit(1);
        } else {
          console.warn("⚠️  Development mode: Server will continue running with in-memory store.");
          return null;
        }
      }
      
      console.log(`🔄 Retrying connection in ${delay / 1000} seconds... (${retries} attempts left)`);
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
    status: states[state] || "unknown",
    isConnected: state === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

module.exports = { connectDB, getDBStatus };
