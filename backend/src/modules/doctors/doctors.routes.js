// src/modules/doctors/doctors.routes.js
const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  getMyAppointments,
  updateAppointmentStatus,
  updateDoctorProfile,
} = require("./doctors.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

// Public
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getDoctorSlots);

// Doctor protected
router.get("/me/appointments", verifyJWT, authorizeRoles("DOCTOR"), getMyAppointments);
router.put("/me/profile", verifyJWT, authorizeRoles("DOCTOR"), updateDoctorProfile);
router.patch("/appointments/:id/status", verifyJWT, authorizeRoles("DOCTOR"), updateAppointmentStatus);

module.exports = router;
