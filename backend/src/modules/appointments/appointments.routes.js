// src/modules/appointments/appointments.routes.js
const express = require("express");
const router = express.Router();
const { bookAppointment, getMyAppointments, getAppointmentById, updateAppointment, cancelAppointment, deleteAppointment } = require("./appointments.controller");
const { verifyJWT, authorizeRoles } = require("../../middleware/auth.middleware");

router.post("/", verifyJWT, authorizeRoles("PATIENT"), bookAppointment);
router.get("/me", verifyJWT, authorizeRoles("PATIENT"), getMyAppointments);
router.get("/:id", verifyJWT, getAppointmentById);
router.put("/:id", verifyJWT, updateAppointment);
router.delete("/:id", verifyJWT, cancelAppointment);
router.delete("/:id/purge", verifyJWT, deleteAppointment);

module.exports = router;
