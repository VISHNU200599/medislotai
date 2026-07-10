// src/modules/hospitals/hospitals.routes.js
const express = require("express");
const router = express.Router();
const { getHospitals, getHospitalBySlug, getHospitalDoctors, createHospital, updateHospital, deleteHospital } = require("./hospitals.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.get("/", getHospitals);
router.post("/", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), createHospital);
router.get("/:slug", getHospitalBySlug);
router.put("/:id", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), updateHospital);
router.delete("/:id", verifyJWT, authorizeRoles("HOSPITAL_ADMIN"), deleteHospital);
router.get("/:id/doctors", getHospitalDoctors);

module.exports = router;
