// src/modules/patients/patients.routes.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getDashboard } = require("./patients.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.get("/profile", verifyJWT, authorizeRoles("PATIENT"), getProfile);
router.put("/profile", verifyJWT, authorizeRoles("PATIENT"), updateProfile);
router.get("/dashboard", verifyJWT, authorizeRoles("PATIENT"), getDashboard);

module.exports = router;
