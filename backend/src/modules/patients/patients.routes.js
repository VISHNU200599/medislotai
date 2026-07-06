// src/modules/patients/patients.routes.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("./patients.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.get("/profile", verifyJWT, authorizeRoles("PATIENT"), getProfile);
router.put("/profile", verifyJWT, authorizeRoles("PATIENT"), updateProfile);

module.exports = router;
