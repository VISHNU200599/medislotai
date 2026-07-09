// src/utils/verifyMongo.js
require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../config/database");

// Define a temporary schema for verifying CRUD operations
const VerifySchema = new mongoose.Schema({
  testId: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

const VerifyModel = mongoose.models.AtlasVerifyTest || mongoose.model("AtlasVerifyTest", VerifySchema);

const runCRUDVerification = async () => {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           🔬 MediSlot AI — MongoDB Atlas CRUD Verify         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");

  try {
    // 1. Establish Connection
    const conn = await connectDB(1, 2000);
    if (!conn) {
      console.error("❌ Cannot verify CRUD: MongoDB Atlas connection was not established.");
      console.error("👉 Please check your MONGODB_URI in backend/.env");
      process.exit(1);
    }

    console.log("\n🚀 Starting CRUD verification suite against MongoDB Atlas...\n");

    // 2. CREATE Operation
    console.log("1️⃣  Testing CREATE (Insert Document)...");
    const testDoc = await VerifyModel.create({
      testId: `VERIFY-${Date.now()}`,
      message: "MediSlot AI MongoDB Atlas Connection Test",
      status: "CREATED",
    });
    console.log(`   ✅ CREATE Success! Document ID: ${testDoc._id}`);

    // 3. READ Operation
    console.log("2️⃣  Testing READ (Query Document)...");
    const fetchedDoc = await VerifyModel.findById(testDoc._id);
    if (!fetchedDoc) {
      throw new Error("Failed to read the newly created document from MongoDB Atlas.");
    }
    console.log(`   ✅ READ Success! Found Message: "${fetchedDoc.message}"`);

    // 4. UPDATE Operation
    console.log("3️⃣  Testing UPDATE (Modify Document)...");
    fetchedDoc.status = "UPDATED_SUCCESSFULLY";
    await fetchedDoc.save();
    console.log(`   ✅ UPDATE Success! New Status: "${fetchedDoc.status}"`);

    // 5. DELETE Operation
    console.log("4️⃣  Testing DELETE (Remove Document)...");
    const deleteResult = await VerifyModel.findByIdAndDelete(testDoc._id);
    console.log(`   ✅ DELETE Success! Removed Document ID: ${deleteResult._id}`);

    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  🎉 ALL CRUD OPERATIONS PASSED SUCCESSFULLY ON MONGODB ATLAS ║");
    console.log("╠══════════════════════════════════════════════════════════════╣");
    console.log(`║  🌐 Host: ${(mongoose.connection.host || "Atlas").padEnd(43)}║`);
    console.log(`║  📦 Database: ${(mongoose.connection.name || "medislotai").padEnd(39)}║`);
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

  } catch (error) {
    console.error("\n❌ CRUD Verification Failed:", error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🛑 Closed MongoDB connection after verification.");
    }
    process.exit(0);
  }
};

runCRUDVerification();
