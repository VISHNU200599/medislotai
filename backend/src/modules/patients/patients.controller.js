// src/modules/patients/patients.controller.js
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get Patient Profile ──────────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const patient = db.patients.find((p) => p.user_id === req.user.id);
  if (!patient) throw new ApiError(404, "Patient profile not found");
  return ApiResponse.success(res, patient);
});

// ─── Update Patient Profile ───────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const patientIndex = db.patients.findIndex((p) => p.user_id === req.user.id);
  if (patientIndex === -1) throw new ApiError(404, "Patient profile not found");

  const allowed = ["full_name", "phone", "date_of_birth", "gender", "blood_group", "address", "emergency_contact"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      db.patients[patientIndex][field] = req.body[field];
    }
  });
  db.patients[patientIndex].updated_at = new Date().toISOString();

  return ApiResponse.success(res, db.patients[patientIndex], "Profile updated successfully");
});

module.exports = { getProfile, updateProfile };
