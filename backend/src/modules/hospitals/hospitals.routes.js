// src/modules/hospitals/hospitals.routes.js
const express = require("express");
const router = express.Router();
const { getHospitals, getHospitalBySlug, getHospitalDoctors } = require("./hospitals.controller");

router.get("/", getHospitals);
router.get("/:slug", getHospitalBySlug);
router.get("/:id/doctors", getHospitalDoctors);

module.exports = router;
