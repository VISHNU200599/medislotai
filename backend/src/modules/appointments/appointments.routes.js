// src/modules/appointments/appointments.routes.js
const express = require("express");
const router = express.Router();
const { bookAppointment, getMyAppointments, getAppointmentById, cancelAppointment } = require("./appointments.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.post("/", verifyJWT, authorizeRoles("PATIENT"), bookAppointment);
router.get("/me", verifyJWT, authorizeRoles("PATIENT"), getMyAppointments);
router.get("/:id", verifyJWT, getAppointmentById);
router.delete("/:id", verifyJWT, cancelAppointment);

module.exports = router;
