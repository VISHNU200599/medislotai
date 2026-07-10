// src/modules/doctors/doctors.controller.js
// Pure MongoDB Atlas Doctors Controller
const { Doctor, Hospital, Department, Appointment, Patient } = require("../../models");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// ─── Get All Doctors (public search) ─────────────────────────────────────────
const getDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, hospital_id, department_id, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    const q = new RegExp(search, "i");
    query.$or = [{ full_name: q }, { specialization: q }, { qualification: q }];
  }

  if (specialization) {
    query.specialization = new RegExp(specialization, "i");
  }

  if (hospital_id) {
    query.hospital_id = hospital_id;
  }

  if (department_id) {
    query.department_id = department_id;
  }

  const doctors = await Doctor.find(query);
  const hospitals = await Hospital.find();
  const departments = await Department.find();

  const enriched = doctors.map((doc) => {
    const hospital = hospitals.find((h) => h._id.toString() === doc.hospital_id);
    const department = departments.find((d) => d._id.toString() === doc.department_id);
    return { ...doc.toObject(), hospital, department };
  });

  const total = enriched.length;
  const start = (page - 1) * limit;
  const paginated = enriched.slice(start, start + parseInt(limit));

  return ApiResponse.paginated(res, paginated, { page: parseInt(page), limit: parseInt(limit), total });
});

// ─── Get Doctor by ID ─────────────────────────────────────────────────────────
const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, "Doctor not found on MongoDB Atlas");

  const hospital = await Hospital.findById(doctor.hospital_id);
  const department = await Department.findById(doctor.department_id);

  return ApiResponse.success(res, {
    ...doctor.toObject(),
    hospital,
    department,
    reviews: [],
    review_count: doctor.review_count || 0,
  });
});

// ─── Get Doctor Slots ─────────────────────────────────────────────────────────
const getDoctorSlots = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Generate clean available time slots dynamically
  const slots = {
    [new Date().toISOString().split("T")[0]]: [
      { id: "slot-1", start_time: "10:00 AM", end_time: "10:30 AM", status: "AVAILABLE" },
      { id: "slot-2", start_time: "11:00 AM", end_time: "11:30 AM", status: "AVAILABLE" },
      { id: "slot-3", start_time: "03:00 PM", end_time: "03:30 PM", status: "AVAILABLE" },
      { id: "slot-4", start_time: "04:30 PM", end_time: "05:00 PM", status: "AVAILABLE" },
    ],
  };

  return ApiResponse.success(res, { doctor_id: id, slots });
});

// ─── Doctor: Get My Appointments ──────────────────────────────────────────────
const getMyAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user_id: req.user.id });
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const { status } = req.query;
  const query = { doctor_id: doctor._id };
  if (status) query.status = status.toUpperCase();

  const appointments = await Appointment.find(query).sort({ created_at: -1 });
  const patients = await Patient.find();

  const enriched = appointments.map((appt) => {
    const patient = patients.find((p) => p._id.toString() === appt.patient_id);
    return { ...appt.toObject(), patient };
  });

  return ApiResponse.success(res, enriched);
});

// ─── Doctor: Update Appointment Status ────────────────────────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const doctor = await Doctor.findOne({ user_id: req.user.id });
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const appointment = await Appointment.findOne({ _id: id, doctor_id: doctor._id });
  if (!appointment) throw new ApiError(404, "Appointment not found");

  const validStatuses = ["CONFIRMED", "CANCELLED", "COMPLETED", "PENDING"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  return ApiResponse.success(res, appointment, "Appointment status updated on MongoDB Atlas");
});

// ─── Doctor: Update Profile ───────────────────────────────────────────────────
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user_id: req.user.id });
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const allowed = ["bio", "consultation_fee", "phone", "profile_pic"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      doctor[field] = req.body[field];
    }
  });
  await doctor.save();

  return ApiResponse.success(res, doctor, "Profile updated successfully on MongoDB Atlas");
});

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  getMyAppointments,
  updateAppointmentStatus,
  updateDoctorProfile,
};
