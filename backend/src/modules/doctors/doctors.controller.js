// src/modules/doctors/doctors.controller.js
const { db } = require("../../config/db");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get All Doctors (public search) ─────────────────────────────────────────
const getDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, hospital_id, department_id, page = 1, limit = 10 } = req.query;

  let doctors = [...db.doctors].filter((d) => d.is_available);

  if (search) {
    const q = search.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.full_name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
    );
  }

  if (specialization) {
    doctors = doctors.filter((d) =>
      d.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }

  if (hospital_id) {
    doctors = doctors.filter((d) => d.hospital_id === hospital_id);
  }

  if (department_id) {
    doctors = doctors.filter((d) => d.department_id === department_id);
  }

  const enriched = doctors.map((doc) => ({
    ...doc,
    hospital: db.hospitals.find((h) => h.id === doc.hospital_id),
    department: db.departments.find((d) => d.id === doc.department_id),
  }));

  const total = enriched.length;
  const start = (page - 1) * limit;
  const paginated = enriched.slice(start, start + parseInt(limit));

  return ApiResponse.paginated(res, paginated, { page: parseInt(page), limit: parseInt(limit), total });
});

// ─── Get Doctor by ID ─────────────────────────────────────────────────────────
const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = db.doctors.find((d) => d.id === id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const hospital = db.hospitals.find((h) => h.id === doctor.hospital_id);
  const department = db.departments.find((d) => d.id === doctor.department_id);
  const reviews = db.reviews.filter((r) => r.doctor_id === id);

  return ApiResponse.success(res, {
    ...doctor,
    hospital,
    department,
    reviews,
    review_count: reviews.length,
  });
});

// ─── Get Doctor Slots ─────────────────────────────────────────────────────────
const getDoctorSlots = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const doctor = db.doctors.find((d) => d.id === id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  let slots = db.slots.filter(
    (s) => s.doctor_id === id && s.status === "AVAILABLE"
  );

  if (date) {
    slots = slots.filter((s) => s.slot_date === date);
  }

  // Group by date
  const grouped = {};
  slots.forEach((slot) => {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = [];
    grouped[slot.slot_date].push(slot);
  });

  return ApiResponse.success(res, { doctor_id: id, slots: grouped });
});

// ─── Doctor: Get My Appointments ──────────────────────────────────────────────
const getMyAppointments = asyncHandler(async (req, res) => {
  const doctor = db.doctors.find((d) => d.user_id === req.user.id);
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const { date, status } = req.query;
  let appointments = db.appointments.filter((a) => a.doctor_id === doctor.id);

  if (date) {
    appointments = appointments.filter((a) => a.appointment_date === date);
  }

  if (status) {
    appointments = appointments.filter((a) => a.status === status.toUpperCase());
  }

  // Sort by date desc
  appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const enriched = appointments.map((appt) => ({
    ...appt,
    patient: db.patients.find((p) => p.id === appt.patient_id),
    slot: db.slots.find((s) => s.id === appt.slot_id),
  }));

  return ApiResponse.success(res, enriched);
});

// ─── Doctor: Update Appointment Status ────────────────────────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const doctor = db.doctors.find((d) => d.user_id === req.user.id);
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const apptIndex = db.appointments.findIndex(
    (a) => a.id === id && a.doctor_id === doctor.id
  );

  if (apptIndex === -1) throw new ApiError(404, "Appointment not found");

  const validStatuses = ["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  db.appointments[apptIndex].status = status;
  if (notes) db.appointments[apptIndex].notes = notes;
  db.appointments[apptIndex].updated_at = new Date().toISOString();

  // If cancelled, free the slot
  if (status === "CANCELLED") {
    const slotIndex = db.slots.findIndex(
      (s) => s.id === db.appointments[apptIndex].slot_id
    );
    if (slotIndex !== -1) db.slots[slotIndex].status = "AVAILABLE";
  }

  return ApiResponse.success(res, db.appointments[apptIndex], "Appointment status updated");
});

// ─── Doctor: Update Profile ───────────────────────────────────────────────────
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const docIndex = db.doctors.findIndex((d) => d.user_id === req.user.id);
  if (docIndex === -1) throw new ApiError(404, "Doctor profile not found");

  const allowed = ["bio", "consultation_fee", "languages", "is_available", "phone"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      db.doctors[docIndex][field] = req.body[field];
    }
  });
  db.doctors[docIndex].updated_at = new Date().toISOString();

  return ApiResponse.success(res, db.doctors[docIndex], "Profile updated successfully");
});

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  getMyAppointments,
  updateAppointmentStatus,
  updateDoctorProfile,
};
