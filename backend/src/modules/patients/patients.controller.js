// src/modules/patients/patients.controller.js
// Pure MongoDB Atlas Patients Controller
const { Patient, Appointment, MedicalRecord, AmbulanceRequest } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get Patient Profile ──────────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user_id: req.user.id });
  if (!patient) throw new ApiError(404, "Patient profile not found on MongoDB Atlas");
  return ApiResponse.success(res, patient);
});

// ─── Update Patient Profile ───────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user_id: req.user.id });
  if (!patient) throw new ApiError(404, "Patient profile not found on MongoDB Atlas");

  const allowed = ["full_name", "phone", "date_of_birth", "gender", "blood_group", "address", "emergency_contact", "profile_pic"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      patient[field] = req.body[field];
    }
  });
  
  await patient.save();
  return ApiResponse.success(res, patient, "Profile updated successfully on MongoDB Atlas");
});

// ─── Get Patient Dashboard Summary ────────────────────────────────────────────
const getDashboard = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user_id: req.user.id });
  if (!patient) throw new ApiError(404, "Patient profile not found");

  const appointments = await Appointment.find({ patient_id: patient._id }).sort({ created_at: -1 });
  const records = await MedicalRecord.find({ patient_id: patient._id }).sort({ created_at: -1 });
  const emergencies = await AmbulanceRequest.find({ patient_id: req.user.id }).sort({ requested_at: -1 });

  return ApiResponse.success(res, {
    patient,
    upcoming_appointments: appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING"),
    past_appointments: appointments.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED"),
    medical_records: records,
    emergencies,
  });
});

module.exports = { getProfile, updateProfile, getDashboard };
