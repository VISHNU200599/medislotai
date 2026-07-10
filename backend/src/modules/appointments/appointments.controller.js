// src/modules/appointments/appointments.controller.js
// Pure MongoDB Atlas Appointments Controller
const { v4: uuidv4 } = require("uuid");
const { Appointment, Patient, Doctor, Hospital } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Book Appointment (CREATE) ────────────────────────────────────────────────
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctor_id, slot_id, reason, appointment_date, symptoms } = req.body;

  if (!doctor_id) {
    throw new ApiError(400, "Doctor ID is required");
  }

  const patient = await Patient.findOne({ user_id: req.user.id }) || await Patient.findOne();
  if (!patient) throw new ApiError(404, "Patient profile not found");

  const doctor = await Doctor.findById(doctor_id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const bookingRef = `MED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const dateStr = appointment_date || new Date().toISOString().split("T")[0];

  const newAppointment = await Appointment.create({
    booking_reference: bookingRef,
    patient_id: patient._id,
    doctor_id: doctor._id,
    hospital_id: doctor.hospital_id,
    slot_id: slot_id || "slot-1",
    appointment_date: dateStr,
    slot: { start_time: "10:30 AM", end_time: "11:00 AM" },
    reason: reason || "Routine Consultation",
    symptoms: symptoms || "",
    status: "CONFIRMED",
  });

  const hospital = await Hospital.findById(doctor.hospital_id);

  return res.status(201).json({
    success: true,
    statusCode: 201,
    message: `Appointment booked successfully! Reference: ${bookingRef}`,
    data: {
      ...newAppointment.toObject(),
      doctor: { id: doctor._id, full_name: doctor.full_name, specialization: doctor.specialization },
      patient: { id: patient._id, full_name: patient.full_name },
      hospital: { id: hospital?._id, name: hospital?.name },
    },
  });
});

// ─── Get Patient Appointments (READ) ──────────────────────────────────────────
const getMyAppointments = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user_id: req.user.id });
  if (!patient) throw new ApiError(404, "Patient profile not found");

  const { status, page = 1, limit = 10 } = req.query;
  const query = { patient_id: patient._id };
  if (status) query.status = status.toUpperCase();

  const appointments = await Appointment.find(query).sort({ created_at: -1 });
  const doctors = await Doctor.find();
  const hospitals = await Hospital.find();

  const enriched = appointments.map((appt) => {
    const doctor = doctors.find((d) => d._id.toString() === appt.doctor_id);
    const hospital = hospitals.find((h) => h._id.toString() === appt.hospital_id);
    return { ...appt.toObject(), doctor, hospital };
  });

  const total = enriched.length;
  const start = (page - 1) * limit;

  return ApiResponse.paginated(
    res,
    enriched.slice(start, start + parseInt(limit)),
    { page: parseInt(page), limit: parseInt(limit), total }
  );
});

// ─── Get Appointment Detail (READ) ────────────────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  const doctor = await Doctor.findById(appointment.doctor_id);
  const patient = await Patient.findById(appointment.patient_id);
  const hospital = await Hospital.findById(appointment.hospital_id);

  return ApiResponse.success(res, {
    ...appointment.toObject(),
    doctor,
    patient,
    hospital,
  });
});

// ─── Update Appointment (UPDATE) ──────────────────────────────────────────────
const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
  if (!appointment) throw new ApiError(404, "Appointment not found");
  return ApiResponse.success(res, appointment, "Appointment updated successfully");
});

// ─── Cancel Appointment ────────────────────────────────────────────────────────
const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancel_reason } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "Appointment is already cancelled");
  }

  appointment.status = "CANCELLED";
  appointment.notes = cancel_reason || "Cancelled by user";
  await appointment.save();

  return ApiResponse.success(res, appointment, "Appointment cancelled successfully on MongoDB Atlas");
});

// ─── Delete Appointment (DELETE) ──────────────────────────────────────────────
const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  return ApiResponse.success(res, { id }, "Appointment deleted successfully from MongoDB Atlas");
});

module.exports = { bookAppointment, getMyAppointments, getAppointmentById, updateAppointment, cancelAppointment, deleteAppointment };
