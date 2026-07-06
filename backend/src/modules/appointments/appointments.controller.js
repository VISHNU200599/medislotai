// src/modules/appointments/appointments.controller.js
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Book Appointment ─────────────────────────────────────────────────────────
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctor_id, slot_id, reason } = req.body;

  if (!doctor_id || !slot_id) {
    throw new ApiError(400, "Doctor ID and Slot ID are required");
  }

  const patient = db.patients.find((p) => p.user_id === req.user.id);
  if (!patient) throw new ApiError(404, "Patient profile not found");

  const doctor = db.doctors.find((d) => d.id === doctor_id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const slot = db.slots.find((s) => s.id === slot_id);
  if (!slot) throw new ApiError(404, "Slot not found");

  if (slot.status !== "AVAILABLE") {
    throw new ApiError(409, "This slot is no longer available. Please choose another.");
  }

  if (slot.doctor_id !== doctor_id) {
    throw new ApiError(400, "Slot does not belong to this doctor");
  }

  // Check for existing appointment same doctor same day
  const existingAppt = db.appointments.find(
    (a) =>
      a.patient_id === patient.id &&
      a.doctor_id === doctor_id &&
      a.appointment_date === slot.slot_date &&
      a.status !== "CANCELLED"
  );

  if (existingAppt) {
    throw new ApiError(409, "You already have an appointment with this doctor on this date");
  }

  // Generate booking reference
  const bookingRef = `MED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newAppointment = {
    id: uuidv4(),
    patient_id: patient.id,
    doctor_id,
    hospital_id: doctor.hospital_id,
    slot_id,
    appointment_date: slot.slot_date,
    status: "CONFIRMED",
    reason: reason || null,
    notes: null,
    booking_reference: bookingRef,
    cancelled_by: null,
    cancel_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Mark slot as booked
  const slotIndex = db.slots.findIndex((s) => s.id === slot_id);
  db.slots[slotIndex].status = "BOOKED";

  db.appointments.push(newAppointment);

  const hospital = db.hospitals.find((h) => h.id === doctor.hospital_id);

  return res.status(201).json({
    success: true,
    statusCode: 201,
    message: `Appointment booked successfully! Reference: ${bookingRef}`,
    data: {
      ...newAppointment,
      doctor: { id: doctor.id, full_name: doctor.full_name, specialization: doctor.specialization, profile_pic: doctor.profile_pic },
      patient: { id: patient.id, full_name: patient.full_name },
      hospital: { id: hospital?.id, name: hospital?.name, address: hospital?.address },
      slot: { start_time: slot.start_time, end_time: slot.end_time, slot_date: slot.slot_date },
    },
  });
});

// ─── Get Patient Appointments ─────────────────────────────────────────────────
const getMyAppointments = asyncHandler(async (req, res) => {
  const patient = db.patients.find((p) => p.user_id === req.user.id);
  if (!patient) throw new ApiError(404, "Patient profile not found");

  const { status, page = 1, limit = 10 } = req.query;

  let appointments = db.appointments.filter((a) => a.patient_id === patient.id);

  if (status) {
    appointments = appointments.filter((a) => a.status === status.toUpperCase());
  }

  appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const enriched = appointments.map((appt) => {
    const doctor = db.doctors.find((d) => d.id === appt.doctor_id);
    const slot = db.slots.find((s) => s.id === appt.slot_id);
    const hospital = db.hospitals.find((h) => h.id === appt.hospital_id);
    return { ...appt, doctor, slot, hospital };
  });

  const total = enriched.length;
  const start = (page - 1) * limit;

  return ApiResponse.paginated(
    res,
    enriched.slice(start, start + parseInt(limit)),
    { page: parseInt(page), limit: parseInt(limit), total }
  );
});

// ─── Get Appointment Detail ────────────────────────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  // Access control
  const patient = db.patients.find((p) => p.user_id === req.user.id);
  const doctor = db.doctors.find((d) => d.user_id === req.user.id);

  const isOwner =
    (patient && appointment.patient_id === patient.id) ||
    (doctor && appointment.doctor_id === doctor.id) ||
    req.user.role === "HOSPITAL_ADMIN";

  if (!isOwner) throw new ApiError(403, "Access denied");

  const enriched = {
    ...appointment,
    doctor: db.doctors.find((d) => d.id === appointment.doctor_id),
    patient: db.patients.find((p) => p.id === appointment.patient_id),
    slot: db.slots.find((s) => s.id === appointment.slot_id),
    hospital: db.hospitals.find((h) => h.id === appointment.hospital_id),
  };

  return ApiResponse.success(res, enriched);
});

// ─── Cancel Appointment ────────────────────────────────────────────────────────
const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancel_reason } = req.body;

  const apptIndex = db.appointments.findIndex((a) => a.id === id);
  if (apptIndex === -1) throw new ApiError(404, "Appointment not found");

  const appointment = db.appointments[apptIndex];

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "Appointment is already cancelled");
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(400, "Cannot cancel a completed appointment");
  }

  // Verify ownership
  const patient = db.patients.find((p) => p.user_id === req.user.id);
  if (patient && appointment.patient_id !== patient.id) {
    throw new ApiError(403, "Not authorized to cancel this appointment");
  }

  db.appointments[apptIndex].status = "CANCELLED";
  db.appointments[apptIndex].cancelled_by = req.user.role;
  db.appointments[apptIndex].cancel_reason = cancel_reason || "No reason provided";
  db.appointments[apptIndex].updated_at = new Date().toISOString();

  // Free the slot
  const slotIndex = db.slots.findIndex((s) => s.id === appointment.slot_id);
  if (slotIndex !== -1) db.slots[slotIndex].status = "AVAILABLE";

  return ApiResponse.success(res, db.appointments[apptIndex], "Appointment cancelled successfully");
});

module.exports = { bookAppointment, getMyAppointments, getAppointmentById, cancelAppointment };
